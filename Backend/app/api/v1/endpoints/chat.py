"""
Chat (direct messages) endpoints.

React Native integration:
  GET  /api/v1/chat/{other_user_id}  → conversation with another user
  POST /api/v1/chat/                 → send a message
  POST /api/v1/chat/{message_id}/like → toggle like on a message
"""
from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.message import Message
from app.models.users import User

router = APIRouter(prefix="/chat", tags=["Chat"])


class SendMessageRequest(BaseModel):
    receiver_id: str
    content: str


@router.post("/", status_code=201, summary="Send a direct message")
def send_message(
    body: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    React Native sends:
        { "receiver_id": "uuid", "content": "Hello!" }
    with Authorization: Bearer <access_token>
    """
    if str(current_user.id) == body.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot message yourself.")

    msg = Message(
        id          = uuid.uuid4(),
        sender_id   = current_user.id,
        receiver_id = body.receiver_id,
        content     = body.content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {
        "id":          str(msg.id),
        "sender_id":   str(msg.sender_id),
        "receiver_id": str(msg.receiver_id),
        "content":     msg.content,
        "created_at":  str(msg.created_at),
    }


@router.get("/{other_user_id}", summary="Get conversation with a user")
def get_conversation(
    other_user_id: str,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns messages between current user and other_user_id, newest last."""
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user.id),
        )
    ).order_by(Message.created_at).limit(limit).all()

    # Mark messages from other user as read
    for m in messages:
        if str(m.receiver_id) == str(current_user.id) and not m.is_read:
            m.is_read = True
    db.commit()

    return [
        {
            "id":          str(m.id),
            "sender_id":   str(m.sender_id),
            "receiver_id": str(m.receiver_id),
            "content":     m.content,
            "liked":       m.liked,
            "is_read":     m.is_read,
            "created_at":  str(m.created_at),
        }
        for m in messages
    ]


@router.post("/{message_id}/like", summary="Toggle like on a message")
def toggle_like(
    message_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found.")
    msg.liked = not msg.liked
    db.commit()
    return {"liked": msg.liked}
