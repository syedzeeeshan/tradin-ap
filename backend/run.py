from fastapi import FastAPI, WebSocket
import random
import asyncio
import datetime

app = FastAPI(title="Trading Signal App")


# 🔹 Generate trading signal
def generate_signal(commodity):
    trend = random.choice(["up", "down", "sideways"])

    if trend == "up":
        signal = "BUY"
    elif trend == "down":
        signal = "SELL"
    else:
        signal = "HOLD"

    return {
        "commodity": commodity,
        "signal": signal,
        "confidence": round(random.uniform(0.7, 0.95), 2),
        "reason": f"{commodity} trend is {trend}",
        "estimated_profit": round(random.uniform(-2, 5), 2),  # profit %
        "timestamp": str(datetime.datetime.now())
    }


# 🔹 Generate fake news with sentiment
def generate_news():
    headlines = [
        {"title": "Gold demand rising globally", "sentiment": "positive"},
        {"title": "Silver market sees uncertainty", "sentiment": "neutral"},
        {"title": "Inflation fears boost gold prices", "sentiment": "positive"},
        {"title": "Strong dollar pressures silver", "sentiment": "negative"},
    ]
    return random.sample(headlines, 2)


# 🔹 WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("Client connected")
    await websocket.accept()

    try:
        while True:
            data = {
                "gold": generate_signal("gold"),
                "silver": generate_signal("silver"),
                "news": generate_news()
            }

            await websocket.send_json(data)

            await asyncio.sleep(3)  # send update every 3 seconds

    except Exception as e:
        print("Client disconnected:", e)