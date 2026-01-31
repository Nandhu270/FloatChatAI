from vectorstore.store import add_doc

def bootstrap_rag():
    add_doc("RAMA buoys are sparsely distributed; nearest-neighbor approximation is standard.")
    add_doc("ERDDAP returns 404 when no data matches query constraints.")
    add_doc("SST (T_25) represents near-surface ocean temperature.")
    add_doc("Salinity (S_41) is measured in PSU and indicates freshwater influence.")

