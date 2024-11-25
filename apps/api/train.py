import pandas as pd
import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification,
    TrainingArguments, 
    Trainer,
    DataCollatorWithPadding
)
from sklearn.model_selection import train_test_split
import numpy as np
from datasets import Dataset


# Check CUDA availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Load model and tokenizer
model_name = "./local_model"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name).to(device)

# Load and prepare dataset
df = pd.read_csv('database.csv', sep=',')
df = df.dropna()  # Remove any rows with missing values

# Debugging: Print the columns of the dataframe
print("Columns in the dataset:", df.columns.tolist())

# Check for expected columns
expected_columns = ['text', 'label']
missing_columns = [col for col in expected_columns if col not in df.columns]
if missing_columns:
    raise ValueError(f"Missing columns in the dataset: {missing_columns}")

# Split dataset
train_df, eval_df = train_test_split(df, test_size=0.2, random_state=42)

# Convert to HuggingFace datasets
def convert_to_dataset(dataframe):
    return Dataset.from_dict({
        'text': dataframe['text'].tolist(),
        'label': dataframe['label'].tolist()
    })

train_dataset = convert_to_dataset(train_df)
eval_dataset = convert_to_dataset(eval_df)

# Tokenization function
def tokenize_function(examples):
    tokenized = tokenizer(
        examples['text'],
        padding=True,
        truncation=True,
        max_length=512
    )
    # Ensure labels are a list of integers, not nested lists
    tokenized['labels'] = [int(label) for label in examples['label']]
    return tokenized

# Tokenize datasets
train_dataset = train_dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=train_dataset.column_names
)
eval_dataset = eval_dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=eval_dataset.column_names
)

# Data collator
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Compute metrics function
def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    
    accuracy = np.mean(predictions == labels)
    
    # Calculate true positives, false positives, false negatives
    tp = np.sum((predictions == 1) & (labels == 1))
    fp = np.sum((predictions == 1) & (labels == 0))
    fn = np.sum((predictions == 0) & (labels == 1))
    
    # Calculate precision, recall, and F1
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1
    }

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=12,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

# Train the model
trainer.train()

# Save the model
output_dir = "./fine_tuned_model"
trainer.save_model(output_dir)
tokenizer.save_pretrained(output_dir)

print(f"Model saved to {output_dir}")

# Evaluate the model
eval_results = trainer.evaluate()
print("\nEvaluation Results:")
for metric, value in eval_results.items():
    print(f"{metric}: {value:.4f}")