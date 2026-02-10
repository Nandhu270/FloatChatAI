import numpy as np
from datetime import timedelta
import pandas as pd
from erddap.client import fetch
from erddap.catalog import ERDDAP_DAILY

def predict_parameter(param, lat, lon, target_date):
    """
    Predicts a parameter value for a future date using historical data from the last 5 years.
    Returns: (predicted_value, unit, history_count)
    """
    if param not in ERDDAP_DAILY:
        return None, "", 0

    dataset_id, variables = ERDDAP_DAILY[param]
    unit = "" # Unit extraction not implemented yet, assuming context known or generic
    
    # Collect historical points
    # We look at the same +/- 5 day window for the past 5 years
    years_back = 5
    
    # X = timestamp (ordinal), Y = value
    X = []
    Y = [] # Avg value for that window

    for i in range(1, years_back + 1):
        past_year_date = target_date.replace(year=target_date.year - i)
        start_d = past_year_date - timedelta(days=5)
        end_d = past_year_date + timedelta(days=5)
        
        # Fetch 10-day window around that date in the past year
        df = fetch(dataset_id, variables, lat, lon, start_d, end_d)
        
        if not df is None and not df.empty:
            # ERDDAP returns strings often, convert to numeric
            # The variable name in df columns might include units, e.g. "T_25"
            # We assume the first variable is the one we want
            main_var = variables[0]
            
            # Filter valid
            try:
                # Find the actual column name that matches the var ID (sometimes ERDDAP adds stuff)
                # But our client returns cols as is.
                # Let's hope client.py logic works. 
                # Actually client.py returns raw rows with column names.
                # We need to ensure we parse floats.
                
                # Check column mapping
                target_col = None
                for c in df.columns:
                    if main_var in c:
                        target_col = c
                        break
                
                if target_col:
                    vals = pd.to_numeric(df[target_col], errors='coerce').dropna()
                    if not vals.empty:
                        mean_val = vals.mean()
                        # Use the ordinal date of the center of that window
                        X.append(past_year_date.toordinal())
                        Y.append(mean_val)
            except Exception:
                continue

    if len(X) < 2:
        return None, "", len(X)

    # Linear Regression
    # y = mx + c
    try:
        z = np.polyfit(X, Y, 1)
        p = np.poly1d(z)
        
        future_ordinal = target_date.toordinal()
        predicted_val = p(future_ordinal)
        
        return round(predicted_val, 2), unit, len(X)
    except Exception:
        return None, "", len(X)
