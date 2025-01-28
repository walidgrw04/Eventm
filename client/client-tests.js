import { Selector } from 'testcafe';

const clientUrl = 'http://localhost:4000'; // Update to match the client serving port

fixture`Event Planner Client Tests`.page(clientUrl);

// Test fetching and displaying events
test('Fetch and display events', async t => {
    const eventCards = Selector('#events-list').find('.card');
    
    // Verify that event cards are displayed
    await t.expect(eventCards.exists).ok('Event cards should be displayed');
    await t.expect(eventCards.count).gt(0, 'At least one event card should be visible');
});

// Test adding a new event
test('Add a new event', async t => {
    const formattedDate = '2025-06-28'; // YYYY-MM-DD format for the date field

    // Fill out the event form and submit
    await t.typeText('#title', 'Test Event 1');
    await t.typeText('#description', 'This is a test event.');
    await t.typeText('#date', formattedDate); // Use the correct format
    await t.typeText('#time', '18:00');
    await t.typeText('#location', 'Test Location');
    await t.click('#event-form button[type="submit"]');

    // Verify the new event is added
    const newEvent = Selector('.card-title').withText('Test Event 1');
    await t.expect(newEvent.exists).ok('Newly added event should be visible', { timeout: 10000 });
});

// Test searching for an event
test('Search for an event', async t => {
    // Type into the search bar
    await t.typeText('#search-bar', 'Test Event 1');
    
    const filteredEvent = Selector('.card-title').withText('Test Event 1');
    const hiddenEvent = Selector('.card-title').withText('Nonexistent Event');

    // Verify search results
    await t.expect(filteredEvent.exists).ok('Filtered event should be visible', { timeout: 5000 });
    await t.expect(hiddenEvent.exists).notOk('Unrelated events should not be visible');
});

// Test deleting the same event
test('Delete the same event', async t => {
    // Locate the delete button for the event to be deleted
    const deleteButton = Selector('.card').withText('Test Event 1').find('.btn-outline-danger');
    
    // Ensure the delete button exists
    await t.expect(deleteButton.exists).ok('Delete button should exist for the event');
    
    // Set up a native dialog handler for the confirmation dialog
    await t.setNativeDialogHandler(() => true);

    // Click the delete button
    await t.click(deleteButton);

    // Wait for the DOM to update after the delete operation
    await t.wait(2000); // Allowing some time for the DOM update

    // Verify the event is deleted
    const deletedEvent = Selector('.card-title').withText('Test Event 1');
    await t.expect(deletedEvent.exists).notOk('Deleted event should not be visible', { timeout: 5000 });
});

// Test updating an existing event
test('Update an existing event', async t => {
    // Find the first event and click the Edit button
    const editButton = Selector('.btn-outline-primary').withText('Edit').nth(0);
    
    // Ensure the Edit button exists and is clickable
    await t.expect(editButton.exists).ok('Edit button should exist');
    await t.click(editButton);

    // Set up a native dialog handler for confirmations
    await t.setNativeDialogHandler(() => true);

    const formattedDate = '2025-07-14'; // YYYY-MM-DD format for the date field

    // Fill out the update form with new details
    await t.typeText('#update-title', 'Updated Event', { replace: true });
    await t.typeText('#update-description', 'Updated Description', { replace: true });
    await t.typeText('#update-date', formattedDate, { replace: true });
    await t.typeText('#update-time', '20:00', { replace: true });
    await t.typeText('#update-location', 'Updated Location', { replace: true });

    // Submit the form
    const submitButton = Selector('#update-form button[type="submit"]');
    await t.expect(submitButton.exists).ok('Submit button should exist');
    await t.click(submitButton);

    // Verify the updated event appears
    const updatedEvent = Selector('.card-title').withText('Updated Event');
    await t.expect(updatedEvent.exists).ok('Updated event should be visible', { timeout: 10000 });
});
