import faiss, numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.IndexFlatL2(384)
docs = []

def add_doc(text):
    emb = model.encode([text])
    index.add(np.array(emb))
    docs.append(text)

def retrieve(query, k=3):
    if index.ntotal == 0:
        return []
    q = model.encode([query])
    _, idx = index.search(np.array(q), k)
    return [docs[i] for i in idx[0]]
