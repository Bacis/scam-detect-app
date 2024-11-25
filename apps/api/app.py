from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import classify_text
from pydantic import BaseModel
import uvicorn

class TextRequest(BaseModel):
    texts: list[str]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(request: TextRequest):
    print("text", request.texts)
    if len(request.texts) == 0:
        return {"predictions": []}
    predictions = classify_text(request.texts)
    print("predictions", predictions)
    return {"predictions": predictions}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
