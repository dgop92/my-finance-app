# Finance App User Stories

## Epics

### EP001: Savings Source Management

Management of savings sources where money can be stored.

### EP002: Financial Record Management

Management of financial records that track the state of finances at different points in time.

### EP003: Expense Tracking

Tracking of relevant expenses associated with financial records.

### EP004: Financial Analysis & Reporting

Views and calculations to analyze financial data over time.

---

## User Stories

### Epic: EP001 - Savings Source Management

#### US001: Create Savings Source

**As a** user  
**I want** to create a new savings source  
**So that** I can track money stored in different locations

---

### Acceptance Criteria

- [x] Users can enter a name for the savings source (e.g., "X Bank", "Y Bank", "Money under the mattress")
- [x] System validates that the name is not empty and its length is less than 100 characters
- [x] The new savings source is saved in the system
- [x] Confirmation is shown when a savings source is created

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US002: List Savings Sources

**As a** user  
**I want** to view a list of all my savings sources  
**So that** I can see all the places where I store my money

---

### Acceptance Criteria

- [x] Users can access a dedicated view that lists all savings sources
- [x] Each savings source displays its name
- [x] The list includes the special "NA" savings source for unclassified money. The "NA" source is predefined and cannot be deleted.
- [x] The list is visually clear and readable

#### US102: Special NA Savings Source Handling

**As a** user  
**I want** the system to maintain a special "NA" savings source for unclassified money  
**So that** I can track funds that don't belong to any specific savings source

---

### Acceptance Criteria

- [x] The system includes a predefined "NA" savings source that cannot be deleted
- [x] When a savings source is deleted, its value is automatically transferred to the "NA" source
- [x] The "NA" source appears in all financial records
- [x] The "NA" source is clearly labeled as a special source for unclassified money

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US003: Update Savings Source

**As a** user  
**I want** to update the name of a savings source  
**So that** I can correct errors or rename it as needed

---

### Acceptance Criteria

- [x] Users can select an existing savings source to edit
- [x] Users can modify the name of the selected savings source
- [x] System validates that the name is not empty and its length is less than 100 characters
- [x] Changes are saved when submitted
- [x] The saving source used is updated across all financial records
- [x] User cannot update the "NA" savings source
- [ ] Confirmation is shown when a savings source is updated

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US004: Handle Savings Source Deletion

**As a** user  
**I want** to delete a savings source and transfer its value to "NA"  
**So that** I can remove sources I no longer use while preserving the financial data

---

### Acceptance Criteria

- [x] Users can select an existing savings source to delete
- [x] System shows a confirmation dialog before deletion
- [x] When confirmed, system transfers any associated values to the "NA" savings source
- [x] The deleted savings source no longer appears in the list
- [x] The saving source stops appearing in all financial records
- [ ] Confirmation is shown when a savings source is deleted

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

### Epic: EP002 - Financial Record Management

#### US005: Create Financial Record

**As a** user  
**I want** to create a new financial record with values for each savings source  
**So that** I can track my financial status at a specific point in time

---

### Acceptance Criteria

- [x] Users can create a new financial record
- [x] The record displays all existing savings sources
- [x] Each savings source field is pre-filled with the value from the previous financial record (or 0 if first record)
- [x] Users can modify the pre-filled values
- [x] The system captures the creation date automatically (local time)
- [x] The record is saved with all entered data
- [ ] Confirmation is shown when a financial record is created

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US006: View Financial Record Details

**As a** user  
**I want** to view the details of a specific financial record  
**So that** I can review the financial information at that point in time

---

### Acceptance Criteria

- [x] Users can select a financial record to view its details
- [x] The view displays all savings sources and their values
- [x] The view shows the total sum of all savings sources
- [x] The view displays the difference from the previous financial record
- [x] The view includes creation and last update timestamps

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US007: List Financial Records

**As a** user  
**I want** to see a list of all my financial records  
**So that** I can track my financial history over time

---

### Acceptance Criteria

- [x] Users can view a list of all financial records
- [x] Records are sorted in descending order by creation date (newest first)
- [x] Each list item displays the record's creation date
- [x] Each list item shows the total sum of all savings sources
- [x] Each list item displays the difference from the previous record
- [x] Users can select a record from the list to view its details

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US008: Update Financial Record

**As a** user  
**I want** to update an existing financial record  
**So that** I can correct errors or update values as needed

---

### Acceptance Criteria

- [x] Users can select an existing financial record to edit
- [x] Users can modify the values for each savings source
- [x] The system updates the "updated at" timestamp automatically
- [x] The system recalculates the total sum after modifications
- [x] Changes are saved when submitted
- [ ] Confirmation is shown when a financial record is updated

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US009: Delete Financial Record

**As a** user  
**I want** to delete an existing financial record
**So that** I can remove records that are no longer relevant or were created in error

---

### Acceptance Criteria

- [ ] Users can delete an existing financial record
- [ ] The deleted record is removed from the list
- [ ] Confirmation is shown when a financial record is deleted

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

### Epic: EP003 - Expense Tracking

#### US309: Add Relevant Expenses to Financial Record

**As a** user  
**I want** to add relevant expenses to a financial record  
**So that** I can note significant expenses that occurred since the previous record

---

### Acceptance Criteria

- [x] Users can add one or more relevant expenses to a financial record
- [x] For each expense, users can enter a name and price in COP
- [x] Expenses are saved with the financial record
- [ ] Confirmation is shown when expenses are added

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US310: View Relevant Expenses

**As a** user  
**I want** to view all relevant expenses for a financial record  
**So that** I can remember significant expenses that occurred

---

### Acceptance Criteria

- [x] Users can view a list of all relevant expenses within a financial record
- [x] Each expense displays its name and price in COP
- [x] The expenses are clearly associated with the specific financial record
- [x] The list is visually clear and readable

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US311: Edit or Remove Relevant Expenses

**As a** user  
**I want** to edit or remove expenses from a financial record  
**So that** I can keep my expense log accurate and relevant

---

### Acceptance Criteria

- [x] Users can select an existing expense to edit
- [x] Users can modify the name and price of an expense
- [x] Users can delete an expense
- [x] Changes are saved when submitted
- [ ] Confirmation is shown when an expense is updated or removed

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

### Epic: EP004 - Financial Analysis & Reporting

#### US012: View Financial Summary

**As a** user  
**I want** to see a summary of my current financial status  
**So that** I can quickly understand my overall financial position

---

### Acceptance Criteria

- [ ] Users can access a dashboard or summary view
- [ ] The view displays the total sum from the most recent financial record
- [ ] The view shows the difference from the previous financial record
- [ ] The view displays a breakdown by savings source
- [ ] All monetary values are displayed in COP with appropriate formatting

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production

---

#### US013: Currency Display and Formatting

**As a** user  
**I want** all monetary values to be displayed in COP with proper formatting  
**So that** I can easily read and understand the financial information

---

### Acceptance Criteria

- [ ] All monetary values are displayed in Colombian Peso (COP)
- [ ] Values use thousands separators for better readability (e.g., 1.000.000 COP)
- [ ] The currency symbol or code is consistently displayed
- [ ] Positive and negative differences are visually distinguished (e.g., colors, +/- signs)

---

### Definition of Done

- Code implemented
- Unit tests written & passed
- UI elements created and responsive
- Meets acceptance criteria
- Reviewed & merged
- Deployed to staging/production
