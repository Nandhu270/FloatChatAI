import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

_model = SentenceTransformer("all-MiniLM-L6-v2")
_index = faiss.IndexFlatL2(384)
_docs = []

def add_doc(text):
    emb = _model.encode([text])
    _index.add(np.array(emb))
    _docs.append(text)

def retrieve(query, k=5):
    if _index.ntotal == 0:
        return []
    q = _model.encode([query])
    _, idx = _index.search(np.array(q), k)
    return [_docs[i] for i in idx[0]]
