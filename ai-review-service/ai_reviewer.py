from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from config import settings

class AIReviewer:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.1
        )
        self.parser = JsonOutputParser()
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert pet adoption counselor. Your task is to review adoption applications and determine if the applicant is suitable for the pet.
            
            Evaluate based on:
            - Living conditions vs pet needs (e.g., yard for large/active breeds)
            - Pet experience and stability
            - Time commitment and daily routine
            - Financial preparedness
            - Safety (children, landlord permission if renting)

            Respond ONLY in strict JSON format:
            {{
                "verdict": "accepted" or "rejected",
                "reason": "A concise explanation (max 60 words) for the decision."
            }}
            """),
            ("user", "Adoption Application Details:\n{details}")
        ])
        
        self.chain = self.prompt | self.model | self.parser

    async def review(self, application_data: dict):
        # Flatten the nested dict for the prompt
        details = f"""
        City: {application_data.get('city')}
        Pet Name: {application_data.get('adoptionDetails', {}).get('petName')}
        Full Name: {application_data.get('personalInfo', {}).get('fullName')}
        Occupation: {application_data.get('personalInfo', {}).get('occupation')}
        Working Hours: {application_data.get('personalInfo', {}).get('workingHours')}
        
        Residence: {application_data.get('livingConditions', {}).get('residenceType')} ({application_data.get('livingConditions', {}).get('ownershipStatus')})
        Has Yard: {application_data.get('livingConditions', {}).get('hasYard')}
        Yard Fenced: {application_data.get('livingConditions', {}).get('yardFenced')}
        Household Members: {application_data.get('livingConditions', {}).get('householdMembers')}
        
        Previous Pets: {application_data.get('petExperience', {}).get('previousPets')}
        Training Experience: {application_data.get('petExperience', {}).get('trainingExperience')}
        
        Reason to Adopt: {application_data.get('adoptionDetails', {}).get('reasonToAdopt')}
        Time with Pet: {application_data.get('adoptionDetails', {}).get('timeWithPet')}
        Exercise Plan: {application_data.get('adoptionDetails', {}).get('exercisePlan')}
        Pet Expenses: {application_data.get('adoptionDetails', {}).get('petExpenses')}
        """
        
        try:
            result = await self.chain.ainvoke({"details": details})
            # Ensure verdict is lowercase and matches enum
            if result.get("verdict"):
                result["verdict"] = result["verdict"].lower()
            return result
        except Exception as e:
            print(f"AI Review Error: {e}")
            return {
                "verdict": "rejected", 
                "reason": "Internal system error during AI review. Manual verification required."
            }

ai_reviewer = AIReviewer()
