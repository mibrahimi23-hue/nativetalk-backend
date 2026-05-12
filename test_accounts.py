#!/usr/bin/env python3
"""
NativeTalk Test Accounts Utility
Provides easy access and testing capabilities for test accounts
"""

import requests
import json
from typing import Dict, List, Tuple, Optional

class NativeTalkTestAccounts:
    """Utility class for managing and testing NativeTalk test accounts"""
    
    # Shared credentials
    SHARED_PASSWORD = "Password123"
    BACKEND_URL = "http://127.0.0.1:8000"
    
    # Student accounts
    STUDENTS = [
        {"email": "alice@example.com", "name": "Alice Johnson", "level": "A1"},
        {"email": "bob@example.com", "name": "Bob Smith", "level": "B1"},
        {"email": "carlos@example.com", "name": "Carlos Garcia", "level": "A2"},
        {"email": "diana@example.com", "name": "Diana Chen", "level": "B2"},
        {"email": "emma@example.com", "name": "Emma Brown", "level": "A1"},
    ]
    
    # Tutor accounts
    TUTORS = [
        {"email": "marie@example.com", "name": "Marie Pierre", "language": "English"},
        {"email": "hans@example.com", "name": "Hans Mueller", "language": "German"},
        {"email": "juan@example.com", "name": "Juan Rodriguez", "language": "Spanish"},
        {"email": "yuki@example.com", "name": "Yuki Tanaka", "language": "Korean"},
        {"email": "sophia@example.com", "name": "Sophia Laurent", "language": "French"},
    ]
    
    def __init__(self, backend_url: str = None):
        """Initialize with optional custom backend URL"""
        if backend_url:
            self.BACKEND_URL = backend_url
    
    def test_login(self, email: str, password: str = None) -> Tuple[bool, Dict]:
        """
        Test login for a specific account
        Returns: (success: bool, response: dict)
        """
        if password is None:
            password = self.SHARED_PASSWORD
        
        try:
            response = requests.post(
                f"{self.BACKEND_URL}/api/v1/auth/login",
                json={"email": email, "password": password},
                timeout=10
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, {"status_code": response.status_code, "error": response.text}
        
        except Exception as e:
            return False, {"error": str(e)}
    
    def test_all_accounts(self) -> Dict:
        """
        Test login for all accounts
        Returns: dict with results
        """
        results = {
            "students": {},
            "tutors": {},
            "summary": {}
        }
        
        # Test students
        student_passed = 0
        for student in self.STUDENTS:
            success, response = self.test_login(student["email"])
            results["students"][student["email"]] = {
                "success": success,
                "name": student["name"],
                "level": student["level"]
            }
            if success:
                student_passed += 1
        
        # Test tutors
        tutor_passed = 0
        for tutor in self.TUTORS:
            success, response = self.test_login(tutor["email"])
            results["tutors"][tutor["email"]] = {
                "success": success,
                "name": tutor["name"],
                "language": tutor["language"]
            }
            if success:
                tutor_passed += 1
        
        # Summary
        results["summary"] = {
            "students_passed": f"{student_passed}/{len(self.STUDENTS)}",
            "tutors_passed": f"{tutor_passed}/{len(self.TUTORS)}",
            "total_passed": f"{student_passed + tutor_passed}/{len(self.STUDENTS) + len(self.TUTORS)}",
            "all_passed": (student_passed == len(self.STUDENTS)) and (tutor_passed == len(self.TUTORS))
        }
        
        return results
    
    def get_student_by_level(self, level: str) -> Optional[Dict]:
        """Get a student account by language level (A1, A2, B1, B2, etc.)"""
        for student in self.STUDENTS:
            if student["level"] == level.upper():
                return student
        return None
    
    def get_tutor_by_language(self, language: str) -> Optional[Dict]:
        """Get a tutor account by language"""
        for tutor in self.TUTORS:
            if tutor["language"].lower() == language.lower():
                return tutor
        return None
    
    def get_test_credentials(self, email: str) -> Dict:
        """Get full credentials for testing"""
        return {
            "email": email,
            "password": self.SHARED_PASSWORD,
            "backend_url": self.BACKEND_URL,
            "login_endpoint": f"{self.BACKEND_URL}/api/v1/auth/login"
        }
    
    def print_summary(self):
        """Print a summary of all test accounts"""
        print("\n" + "="*70)
        print("NATIVETALK TEST ACCOUNTS SUMMARY")
        print("="*70)
        
        print("\nSTUDENT ACCOUNTS (5):")
        print("-"*70)
        for student in self.STUDENTS:
            print(f"  {student['email']:30} | Level: {student['level']:3} | {student['name']}")
        
        print("\nTUTOR ACCOUNTS (5):")
        print("-"*70)
        for tutor in self.TUTORS:
            print(f"  {tutor['email']:30} | {tutor['language']:10} | {tutor['name']}")
        
        print("\nCREDENTIALS:")
        print("-"*70)
        print(f"  Shared Password: {self.SHARED_PASSWORD}")
        print(f"  Backend URL:     {self.BACKEND_URL}")
        
        print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    import sys
    
    print("NativeTalk Test Accounts Utility")
    print("="*70)
    
    utility = NativeTalkTestAccounts()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "test-all":
            print("\nTesting all accounts...\n")
            results = utility.test_all_accounts()
            print(json.dumps(results, indent=2))
        
        elif sys.argv[1] == "test":
            if len(sys.argv) > 2:
                email = sys.argv[2]
                print(f"\nTesting account: {email}")
                success, response = utility.test_login(email)
                if success:
                    print(f"  Status: SUCCESS")
                    print(f"  User: {response.get('user', {}).get('full_name')}")
                    print(f"  Role: {response.get('user', {}).get('role')}")
                else:
                    print(f"  Status: FAILED")
                    print(f"  Error: {response}")
            else:
                print("Usage: python test_accounts.py test <email>")
        
        elif sys.argv[1] == "summary":
            utility.print_summary()
        
        else:
            print(f"Unknown command: {sys.argv[1]}")
            print("\nAvailable commands:")
            print("  test-all      - Test all accounts")
            print("  test <email>  - Test specific account")
            print("  summary       - Print account summary")
    
    else:
        utility.print_summary()
        print("Run with 'summary' to see account list")
        print("Run with 'test-all' to test all accounts")
        print("Run with 'test <email>' to test specific account")
