import hashlib
import json
import datetime
from typing import Any
from sqlalchemy.orm import Session
from backend.app.models import AuditEvent

def compute_sha256(data: Any) -> str:
    """Computes deterministic SHA-256 hash string for an object or payload."""
    serialized = json.dumps(data, sort_keys=True, default=str)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

def record_audit_event(
    db: Session,
    entity_type: str,
    entity_id: str,
    event_type: str,
    actor: str = "system_worker",
    input_data: Any = None,
    output_data: Any = None,
    metadata: dict = None,
    parent_event_id: str = None
) -> AuditEvent:
    """Appends an immutable audit event into the append-only audit log."""
    input_hash = compute_sha256(input_data) if input_data is not None else None
    output_hash = compute_sha256(output_data) if output_data is not None else None

    event = AuditEvent(
        entity_type=entity_type,
        entity_id=entity_id,
        event_type=event_type,
        event_timestamp=datetime.datetime.utcnow(),
        actor=actor,
        service_version="v2.4.0",
        input_hash=input_hash,
        output_hash=output_hash,
        parent_event_id=parent_event_id,
        metadata_json=metadata or {}
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
