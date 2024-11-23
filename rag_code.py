import random

# Mock knowledge base
knowledge_base = {
    "topic1": ["Doc1 about topic1", "Doc2 about topic1"],
    "topic2": ["Doc1 about topic2", "Doc2 about topic2"],
}

# Function to retrieve documents (redundant logic)
def retrieve_documents_topic1():
    return knowledge_base["topic1"]

def retrieve_documents_topic2():
    return knowledge_base["topic2"]

# Function to process documents (overly modularized)
def preprocess_document(doc):
    return doc.lower()

def process_documents(docs):
    return [preprocess_document(doc) for doc in docs]

# Function to generate response (inefficient dependencies)
def generate_response_topic1():
    docs = retrieve_documents_topic1()
    processed_docs = process_documents(docs)
    return f"Response based on {processed_docs}"

def generate_response_topic2():
    docs = retrieve_documents_topic2()
    processed_docs = process_documents(docs)
    return f"Response based on {processed_docs}"

# Main function
def main():
    topic = random.choice(["topic1", "topic2"])
    if topic == "topic1":
        print(generate_response_topic1())
    else:
        print(generate_response_topic2())

if __name__ == "__main__":
    main()