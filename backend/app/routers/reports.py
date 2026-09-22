import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.models import ReportJob
from backend.app.schemas import (
    ApiResponse, MetaInfo, ReportJobResponse, ReportCreateRequest
)
from backend.app.services.report_generator import generate_report_file
from backend.app.services.audit_service import record_audit_event

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.get("/templates")
def list_report_templates():
    templates = [
        {"type": "Monthly CPI Airfare Bulletin", "description": "Official statistical release with Fisher & Laspeyres indices and CPI baseline comparison.", "supported_formats": ["PDF", "XLSX"]},
        {"type": "Route Volatility Dossier", "description": "Detailed route-by-route dispersion, dominant carrier spreads, and 30-day volatility rankings.", "supported_formats": ["XLSX", "CSV"]},
        {"type": "High-Severity Anomaly Audit", "description": "Compendium of flagged fare spikes, corroborating evidence, and review logs.", "supported_formats": ["CSV", "PDF"]},
        {"type": "Methodology Comparison Report", "description": "Cross-formula divergence analysis (Fisher vs Jevons vs Dutot vs Laspeyres).", "supported_formats": ["PDF", "XLSX"]}
    ]
    return ApiResponse(data=templates)

@router.get("/jobs", response_model=ApiResponse[List[ReportJobResponse]])
def list_report_jobs(db: Session = Depends(get_db)):
    jobs = db.query(ReportJob).order_by(desc(ReportJob.created_at)).all()
    return ApiResponse(
        data=[ReportJobResponse.from_orm(j) for j in jobs],
        meta=MetaInfo(page=1, page_size=len(jobs), total=len(jobs))
    )

@router.post("/export", response_model=ApiResponse[ReportJobResponse])
def create_export_job(payload: ReportCreateRequest, db: Session = Depends(get_db)):
    job = ReportJob(
        title=payload.title,
        report_type=payload.report_type,
        format=payload.format.upper(),
        period=payload.period,
        status="GENERATING",
        file_size="Generating..."
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Generate real report file
    try:
        generate_report_file(db, job)
        record_audit_event(
            db=db,
            entity_type="Report",
            entity_id=job.job_id,
            event_type="EXPORT",
            actor="report_generator",
            input_data=payload.dict(),
            output_data={"file_size": job.file_size, "checksum": job.checksum}
        )
    except Exception as e:
        job.status = "FAILED"
        job.file_size = "Error"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

    return ApiResponse(data=ReportJobResponse.from_orm(job))

@router.get("/jobs/{job_id}", response_model=ApiResponse[ReportJobResponse])
def get_report_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ReportJob).filter(ReportJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Report job {job_id} not found")
    return ApiResponse(data=ReportJobResponse.from_orm(job))

@router.get("/jobs/{job_id}/download")
def download_report_file(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ReportJob).filter(ReportJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Report job {job_id} not found")
    
    # If file does not exist on disk yet, generate it
    if not job.file_path or not os.path.exists(job.file_path):
        generate_report_file(db, job)

    media_types = {
        "PDF": "application/pdf",
        "XLSX": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "CSV": "text/csv"
    }
    media_type = media_types.get(job.format.upper(), "application/octet-stream")
    filename = os.path.basename(job.file_path)

    return FileResponse(
        path=job.file_path,
        media_type=media_type,
        filename=filename
    )
