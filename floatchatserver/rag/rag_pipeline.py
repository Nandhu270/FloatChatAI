from django.db import connection
from .sql_generator import nl_to_sql
from .vector_store import load_index
from .gemini_client import get_model
from google import genai
import os
import numpy as np

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def run_rag(question: str):
    sql = nl_to_sql(question)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()

    index, docs = load_index()

    q_vec = client.models.embed_content(
        model="text-embedding-004",
        contents=question
    ).embeddings[0].values

    D, I = index.search(
        np.array([q_vec]).astype("float32"), k=3
    )

    context = "\n".join([docs[i] for i in I[0]])

    model = get_model()
    answer = model.generate_content(
        f"""
Context:
{context}

SQL Result:
{rows}

Question:
{question}
"""
    )

    return {
        "sql": sql,
        "rows": rows,
        "answer": answer.text
    }
