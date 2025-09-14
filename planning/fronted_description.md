# Finance App Frontend Description

This document provides a detailed description of the user interface for the Finance App, organized by screen. Each screen description includes layout structure, component placement, navigation flow, and UI/UX considerations for both desktop and mobile layouts.

## Global Navigation and Layout

### Desktop Layout
- **Header**: Fixed at the top, containing app logo (left), app name (center), and navigation menu (right)
- **Main Content Area**: Central section that displays the active screen content
- **Footer**: Minimal footer with copyright information

### Mobile Layout
- **Header**: Fixed at the top with app logo (left) and hamburger menu icon (right)
- **Mobile Navigation**: Full-screen overlay menu that appears when the hamburger icon is clicked
- **Main Content Area**: Full-width display below the header
- **Footer**: Minimal footer with copyright information

### Navigation Structure
- Home/Dashboard (default landing page)
- Savings Sources
- Financial Records
- Analysis & Reports

---

## 1. Dashboard Screen

### Purpose
Primary landing page displaying a financial summary and key information.

### Desktop Layout

#### Header Section
- **Components**:
  - App logo (left): Brand identifier
  - App name "Finance App" (center): Reinforces brand identity
  - Navigation menu (right): Links to main sections (Dashboard, Savings Sources, Financial Records, Analysis)

#### Main Content Section
- **Financial Summary Card** (Top)
  - Current total balance: Large, prominent display of total sum from most recent financial record
  - Change since previous record: Displayed with up/down arrow, percentage and absolute value
  - Currency formatting: All monetary values in COP with thousands separators (e.g., 1.000.000 COP)
  - Positive changes in green with "+" prefix, negative in red with "-" prefix

- **Savings Source Breakdown** (Middle)
  - Horizontal bar chart showing proportion of money in each savings source
  - Legend displaying savings source names and their current values
  - Special "NA" source visually distinguished from other sources (different color or pattern)

- **Recent Financial Records** (Bottom)
  - Mini table showing 3-5 most recent records with date, total amount, and change
  - "View All Records" button leading to the Financial Records screen

#### Right Sidebar (Desktop Only)
- **Quick Actions**
  - "New Financial Record" button
  - "Manage Savings Sources" button
  - "View Analysis" button

### Mobile Layout
- Stacked vertical layout of all components
- No sidebar; quick action buttons placed below financial summary
- Collapsible sections for savings breakdown and recent records to save space
- Hamburger menu in header reveals full navigation

### UI/UX Considerations
- Color-coded financial changes (green for positive, red for negative)
- Responsive data visualization that scales appropriately for screen sizes
- Clear call-to-action buttons for primary tasks
- Visual hierarchy emphasizing the most important information (total balance)

---

## 2. Savings Sources Screen

### Purpose
Manage all savings sources where money can be stored.

### Desktop Layout

#### Header Section
- Standard global header with active "Savings Sources" navigation item highlighted

#### Main Content Section
- **Controls Bar** (Top)
  - "Add New Source" button (right-aligned)
  
- **Savings Sources Table** (Center)
  - Columns: Source Name, Latest Value, Actions (Edit, Delete)
  - Special "NA" savings source row has disabled delete button and visual indicator
  - Edit button opens inline editing or a modal
  - Delete button shows confirmation dialog explaining that values will be transferred to "NA"

### Mobile Layout
- Controls stacked vertically (search field, then add button)
- Card-based layout instead of table
- Each card contains:
  - Source name (top)
  - Latest value (middle)
  - Action buttons (bottom)
- Scrollable list of cards instead of pagination

### Modals and Dialogs

#### Add/Edit Savings Source Modal
- **Components**:
  - Title: "Add New Source" or "Edit Source"
  - Name input field with validation (required, max 100 chars)
  - Cancel and Save buttons
  - Validation error messages displayed below field when applicable

#### Delete Confirmation Dialog
- **Components**:
  - Warning title and icon
  - Explanation that values will be transferred to "NA" savings source
  - Cancel and Confirm Delete buttons

### UI/UX Considerations
- Clear visual hierarchy with primary actions emphasized
- Input validation with immediate feedback
- Confirmation for destructive actions
- Visual distinction for the special "NA" source
- Responsive layout that works well on all device sizes

---

## 3. Financial Records List Screen

### Purpose
View all financial records in chronological order.

### Desktop Layout

#### Header Section
- Standard global header with active "Financial Records" navigation item highlighted

#### Controls Bar
- **Components**:
  - Date range filter (From/To date pickers)
  - Search field to filter records
  - "Add New Record" button (right-aligned)

#### Financial Records Table
- **Columns**:
  - Date (formatted as DD/MM/YYYY)
  - Total Amount
  - Change from Previous (amount and percentage)
  - Last Updated timestamp
  - Actions (View Details, Edit)
- Records sorted by date (newest first) by default
- Column headers allow sorting
- Change column shows colored indicators (green for positive, red for negative)

#### Pagination Controls
- Page numbers and next/previous buttons
- Items per page selector

### Mobile Layout
- Controls stacked vertically (date filters, search, add button)
- Card-based layout instead of table
- Each card contains:
  - Date (top, prominent)
  - Total amount (large, centered)
  - Change from previous (with color indicator)
  - View and Edit buttons (bottom)
- Pull-to-refresh functionality
- Infinite scroll instead of pagination

### UI/UX Considerations
- Clear date formatting
- Consistent currency formatting
- Visual indicators for financial changes
- Easy access to create new records
- Responsive design that adapts to screen size

---

## 4. Financial Record Detail Screen

### Purpose
View and edit detailed information for a specific financial record.

### Desktop Layout

#### Header Section
- Standard global header
- Breadcrumb navigation showing: Financial Records > Record Date

#### Record Header
- **Components**:
  - Record date (large, prominent)
  - Last updated timestamp
  - Total sum across all sources
  - Change from previous record (with visual indicator)
  - Edit Record button
  - Back to List button

#### Savings Sources Breakdown
- **Components**:
  - Table showing all savings sources and their values
  - Columns: Source Name, Value, Difference from Previous Record
  - Differences shown with up/down indicators and colors
  - Total row at bottom

#### Relevant Expenses Section
- **Components**:
  - Section title with total expenses amount
  - "Add Expense" button
  - Table of expenses with columns: Name, Amount, Actions (Edit, Delete)
  - Empty state message if no expenses

### Mobile Layout
- Stacked vertical layout
- Collapsible sections for savings breakdown and expenses
- Expenses displayed as cards instead of table rows
- Action buttons moved to fixed bottom bar for easy access

### Modals and Dialogs

#### Edit Financial Record Modal
- **Components**:
  - Title with record date
  - Form with input fields for each savings source value
  - Cancel and Save buttons

#### Add/Edit Expense Modal
- **Components**:
  - Title: "Add Expense" or "Edit Expense"
  - Name input field (required)
  - Amount input field in COP (required, numeric)
  - Cancel and Save buttons

#### Delete Expense Confirmation
- **Components**:
  - Confirmation message
  - Cancel and Confirm Delete buttons

### UI/UX Considerations
- Consistent formatting of monetary values
- Clear grouping of related information
- Visual distinction between read-only and editable views
- Confirmation for destructive actions
- Input validation with immediate feedback

---

## 5. Create/Edit Financial Record Screen

### Purpose
Create a new financial record or edit an existing one.

### Desktop Layout

#### Header Section
- Standard global header
- Breadcrumb navigation showing: Financial Records > New Record or Financial Records > Edit Record (Date)

#### Form Section
- **Components**:
  - Date display (auto-filled with current date for new records)
  - Form with labeled input fields for each savings source
  - Each field pre-filled with previous record's value (if editing or creating a new record with existing history)
  - Each field shows the savings source name and has appropriate input validation
  - Running total displayed at bottom, updating as values change
  - Cancel and Save buttons

#### Relevant Expenses Section (for editing existing record)
- Same as in Detail View, with full editing capabilities
- Ability to add, edit, and remove expenses

### Mobile Layout
- Stacked vertical layout
- Grouped inputs to minimize scrolling
- Fixed action buttons at bottom of screen
- Collapsible expenses section

### UI/UX Considerations
- Clear input labeling
- Numeric keyboard for amount inputs on mobile
- Validation with immediate feedback
- Real-time calculation of total as values are changed
- Confirmation before canceling if changes have been made

---

## 6. Analysis & Reports Screen

### Purpose
View financial trends and analysis over time.

### Desktop Layout

#### Header Section
- Standard global header with active "Analysis & Reports" navigation item highlighted

#### Controls Bar
- **Components**:
  - Date range selector (From/To)
  - Grouping options (By month, quarter, year)
  - Export data button

#### Charts Section
- **Financial Growth Chart**
  - Line chart showing total balance over time
  - Y-axis: Total amount
  - X-axis: Time periods based on selected grouping
  - Toggleable lines for individual savings sources

- **Savings Distribution**
  - Pie chart or stacked bar showing distribution across savings sources
  - Legend with color coding and percentages
  - Interactive elements to highlight specific sources

- **Period Comparison**
  - Bar chart showing period-to-period changes
  - Positive and negative changes clearly distinguished

### Mobile Layout
- Stacked charts with horizontal scrolling for detailed views
- Simplified controls with dropdown menus
- Charts optimized for touch interaction
- One chart visible at a time with tab navigation

### UI/UX Considerations
- Responsive data visualizations
- Consistent color coding across all charts
- Interactive elements for exploring data points
- Clear labels and legends
- Loading states for data processing
- Appropriate empty states when no data is available

---

## Responsive Design Considerations

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### Global Responsive Behaviors
- **Navigation**: Changes from horizontal menu to hamburger menu on smaller screens
- **Tables**: Transform to cards on mobile devices
- **Filters and Controls**: Stack vertically on smaller screens
- **Charts**: Simplify and resize appropriately for smaller screens
- **Modals**: Take full screen on mobile devices
- **Touch Targets**: Minimum 44x44px for touch interfaces
- **Typography**: Fluid sizing that scales between breakpoints

### Accessibility Considerations
- Sufficient color contrast
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators for interactive elements
- Alternative text for charts and graphs
- Semantic HTML structure

---

## Data Entry and Validation Rules

### Currency Input
- Input should enforce numeric values with proper decimal handling
- Thousands separators automatically applied
- COP currency symbol/code consistently displayed
- Validation for maximum and minimum values

### Form Validation
- Required fields clearly marked
- Inline validation with immediate feedback
- Error states visually distinct
- Clear error messages explaining the issue and how to resolve it

### Confirmation Messages
- Success confirmations for all create/update/delete actions
- Temporary toast notifications for non-disruptive feedback
- Modal dialogs for actions requiring explicit confirmation

---

## Navigation Flow

1. **App Entry**: User lands on Dashboard screen
2. **Creating Financial Record**: 
   - From Dashboard or Financial Records List → Create Financial Record Screen → Save → Return to Financial Records List with confirmation
3. **Managing Savings Sources**:
   - From any screen → Savings Sources Screen → Add/Edit/Delete actions → Immediate update with confirmation
4. **Viewing Record Details**:
   - From Financial Records List → Select record → Record Detail Screen
   - From Record Detail → Edit → Edit Record Screen → Save → Return to Detail with confirmation
5. **Adding Expenses**:
   - From Record Detail → Add Expense → Fill form → Save → Return to Detail with confirmation

This navigation structure prioritizes ease of access to frequently used features while maintaining a clear hierarchy of information.
