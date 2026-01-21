from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

def generate_sales_report_pdf(report_data: dict) -> bytes:
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()
    elements = []

    # Title

    elements.append(
        Paragraph("<b>Sales Report</b>", styles["Title"])
    )
    elements.append(Spacer(1, 0.2 * inch))

    # Time Period

    time_period = report_data.get("time_period", {})
    period_label = time_period.get("label", "All Time")

    elements.append(
        Paragraph(f"<b>Time Period:</b> {period_label}", styles["Normal"])
    )

    elements.append(
        Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d %b %Y, %H:%M')}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 0.3 * inch))

    # Metrics Table

    metrics = report_data.get("metrics", {})

    table_data = [
        ["Metric", "Value"],
        ["Total Bookings", metrics.get("total_bookings", 0)],
        ["Total Amount Transferred", f"₹ {metrics.get('total_amount_transferred', 0):,.2f}"],
        ["Total Platform Fee Collected", f"₹ {metrics.get('total_platform_fee_collected', 0):,.2f}"],
        ["New Users", metrics.get("new_users_count", 0)],
        ["New Agencies", metrics.get("new_agencies_count", 0)],
        ["Average Booking Price", f"₹ {metrics.get('average_booking_price', 0):,.2f}"],
        ["Average Platform Fee", f"₹ {metrics.get('average_platform_fee', 0):,.2f}"],
    ]

    table = Table(table_data, colWidths=[3 * inch, 2.5 * inch])

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("TOPPADDING", (0, 0), (-1, 0), 10),
        ])
    )

    elements.append(table)

    # Build PDF
    doc.build(elements)

    pdf = buffer.getvalue()
    buffer.close()

    return pdf

