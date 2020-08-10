export interface Student {
    id: string;
    branch: "CSE" | "ECE" | "MECH" | "ELECTRICAL";
    grade: "A" | "B" | "C" | "D";
    addresses?: Array<{ zipCode: string; streetName: string }>;
    schooling: { CBSE: number } | { stateBoard: number };
    collegeGPA: number | null;
}

export const studentMap: Map<string, Student> = new Map();

function isValidNewId(id: any): id is Student["id"] {
    return typeof id === "string" && !studentMap.has(id);
}

function isValidOldId(id: string): id is Student["id"] {
    return typeof id === "string" && studentMap.has(id);
}

function isValidBranch(branch: any): branch is Student["id"] {
    switch (branch) {
        case "CSE":
        case "ECE":
        case "MECH":
        case "ELECTRICAL":
            return true;
    }
    return false;
}

function isValidGrade(grade: any): grade is Student["grade"] {
    switch (grade) {
        case "A":
        case "B":
        case "C":
            return true;
    }
    return false;
}

function isValidAddress(
    address: any
): address is { zipCode: string; city: string } {
    return !!(
        address &&
        typeof address === "object" &&
        typeof address["zipCode"] === "string" &&
        typeof address["streetName"] === "string"
    );
}

function isValidAddresses(addresses: any): addresses is Student["addresses"] {
    return (
        Array.isArray(addresses) &&
        addresses.every((address) => isValidAddress(address))
    );
}

function isValidSchooling(schooling: any): schooling is Student["schooling"] {
    if (!schooling || typeof schooling !== "object") return false;

    return (
        ("CBSE" in schooling &&
            typeof schooling["CBSE"] === "number" &&
            schooling["CBSE"] >= 0 &&
            schooling["CBSE"] <= 10) ||
        ("stateBoard" in schooling &&
            typeof schooling["stateBoard"] === "number" &&
            schooling["stateBoard"] >= 0 &&
            schooling["stateBoard"] <= 100)
    );
}

function isValidCollegeGPA(gpa: any): gpa is Student["collegeGPA"] {
    if (gpa === null) return true;
    return typeof gpa === "number" && gpa >= 0 && gpa <= 10;
}

export function isValidStudent(student: any): student is Student {
    if (!student || typeof student !== "object") return false;
    return (
        typeof student["id"] === "string" &&
        isValidBranch(student["branch"]) &&
        isValidGrade(student["grade"]) &&
        ("address" in student
            ? isValidAddresses(student["addresses"])
            : true) &&
        isValidSchooling(student["schooling"]) &&
        isValidCollegeGPA(student["collegeGPA"])
    );
}

export function isValidNewStudent(student: any): student is Student {
    return isValidStudent(student) && isValidNewId(student.id);
}

export function isValidOldStudent(student: any): student is Student {
    return isValidStudent(student) && isValidOldId(student.id);
}
