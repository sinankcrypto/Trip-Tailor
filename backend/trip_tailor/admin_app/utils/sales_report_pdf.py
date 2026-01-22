from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

def generate_sales_report_pdf(report_data: dict) -> bytes:
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="AppTitle",
            parent=styles["Title"],
            fontSize=18,
            leading=22,
            spaceAfter=6,
        )
    )

    styles.add(
        ParagraphStyle(
            name="ReportTitle",
            parent=styles["Heading2"],
            fontSize=14,
            leading=18,
            spaceAfter=10,
        )
    )
    elements = []

    # Title

    elements.append(Paragraph("<b>Trip Tailor</b>", styles["AppTitle"]))
    elements.append(Spacer(1, 6))

    elements.append(Paragraph("Sales Report", styles["ReportTitle"]))
    elements.append(Spacer(1, 10))


    # Time Period

    time_period = report_data.get("time_period", {})
    period_label = time_period.get("label", "All Time")

    if period_label != "All Time":
        period_text = f"{time_period.get('start_date')} - {time_period.get('end_date')}"
    else:
        period_text = period_label

    elements.append(
        Paragraph(f"<b>Time Period:</b> {period_text}", styles["Normal"])
    )


    elements.append(
        Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d %b %Y, %H:%M')}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 12))

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
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ALIGN", (1, 1), (-1, -1), "RIGHT"),

            # 👇 tighter padding
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ])
    )

    elements.append(table)

    def draw_header_footer(canvas, doc):
        canvas.saveState()

        # Footer text
        footer_text = (
            "© Trip Tailor | "
            "For queries: triptailor.boss@gmail.com"
        )

        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(colors.grey)
        canvas.drawCentredString(
            A4[0] / 2,
            20,
            footer_text
        )

        canvas.restoreState()

    # Build PDF
    doc.build(
        elements,
        onFirstPage=draw_header_footer,
        onLaterPages=draw_header_footer,
    )

    pdf = buffer.getvalue()
    buffer.close()

    return pdf

