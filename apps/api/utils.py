from dotenv import load_dotenv
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


# # Load AWS credentials from .env file
# load_dotenv()

model_directory = "./fine_tuned_model"

model = AutoModelForSequenceClassification.from_pretrained(model_directory)
tokenizer = AutoTokenizer.from_pretrained(model_directory)

def classify_text(texts):
    # Ensure input is always a list of texts
    if not isinstance(texts, list):
        raise ValueError("Input must be a list of texts.")
    
    # Tokenize all inputs at once
    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )
    
    # Make predictions for all texts in batch
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_probabilities = torch.nn.functional.softmax(logits, dim=1).tolist()
    
    # Return list of tuples containing the text and its probability of being a 1
    return [(text, predicted_probabilities[i][1]) for i, text in enumerate(texts)]

