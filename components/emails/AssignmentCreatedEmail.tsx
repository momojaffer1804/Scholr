import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Button,
} from "@react-email/components";

interface AssignmentCreatedEmailProps {
  studentName: string;
  assignmentTitle: string;
  courseCode: string;
  dueDate: string;
  priority: string;
}

export function AssignmentCreatedEmail({
  studentName = "Student",
  assignmentTitle = "Database Design Submission",
  courseCode = "DBMS",
  dueDate = "2026-10-05",
  priority = "HIGH",
}: AssignmentCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Scholr Academic Notification</Heading>
          <Text style={textStyle}>Hello {studentName},</Text>
          <Text style={textStyle}>
            A new academic assignment has been logged into your Scholr workspace for <strong>{courseCode}</strong>.
          </Text>

          <Section style={boxStyle}>
            <Text style={detailItemStyle}><strong>Assignment:</strong> {assignmentTitle}</Text>
            <Text style={detailItemStyle}><strong>Course Code:</strong> {courseCode}</Text>
            <Text style={detailItemStyle}><strong>Due Date:</strong> {dueDate}</Text>
            <Text style={detailItemStyle}><strong>Priority Level:</strong> {priority}</Text>
          </Section>

          <Button href="http://localhost:3000/assignments" style={buttonStyle}>
            View Assignment in Workspace
          </Button>

          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            Scholr Academic Productivity Platform — Dwarkadas J. Sanghvi College of Engineering
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const mainStyle = {
  backgroundColor: "#f4f4f5",
  fontFamily: "Times New Roman, serif",
  padding: "20px",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  border: "1.5px solid #18181b",
  padding: "30px",
  maxWidth: "560px",
  margin: "0 auto",
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "bold" as const,
  color: "#18181b",
  borderBottom: "2px solid #7c3aed",
  paddingBottom: "10px",
  marginBottom: "20px",
};

const textStyle = {
  fontSize: "14px",
  color: "#27272a",
  lineHeight: "1.5",
  marginBottom: "12px",
};

const boxStyle = {
  backgroundColor: "#fafafa",
  border: "1px solid #e4e4e7",
  padding: "16px",
  marginBottom: "20px",
};

const detailItemStyle = {
  fontSize: "13px",
  color: "#18181b",
  margin: "4px 0",
};

const buttonStyle = {
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "bold" as const,
  padding: "10px 18px",
  borderRadius: "2px",
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle = {
  borderColor: "#e4e4e7",
  margin: "25px 0 15px 0",
};

const footerStyle = {
  fontSize: "11px",
  color: "#71717a",
  textAlign: "center" as const,
};
