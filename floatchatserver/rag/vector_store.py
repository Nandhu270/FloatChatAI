import faiss
import numpy as np
import pickle
import os
from .embeddings import embed_text

VECTOR_DIR = "data/faiss"

def build_index(texts: list):
    vectors = [embed_text(t) for t in texts]
    dim = len(vectors[0])

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(vectors).astype("float32"))

    os.makedirs(VECTOR_DIR, exist_ok=True)
    faiss.write_index(index, f"{VECTOR_DIR}/index.faiss")

    with open(f"{VECTOR_DIR}/docs.pkl", "wb") as f:
        pickle.dump(texts, f)

def load_index():
    index = faiss.read_index(f"{VECTOR_DIR}/index.faiss")
    with open(f"{VECTOR_DIR}/docs.pkl", "rb") as f:
        docs = pickle.load(f)
    return index, docs
