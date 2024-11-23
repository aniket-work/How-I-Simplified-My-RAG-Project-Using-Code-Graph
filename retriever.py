import random

def retrieve_documents(query, documents):
    """Retrieve top documents matching the query."""
    return [doc for doc in documents if query.lower() in doc.lower()]

def redundant_retrieve(query, documents):
    """Redundant retrieval function (not used)."""
    return retrieve_documents(query, documents)
