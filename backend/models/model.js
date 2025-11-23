/**
 * Returns a static list of Clemson campus events.
 *
 * @returns {Array<Object>} Array of event objects with properties:
 *   - id {number}: Unique event ID
 *   - name {string}: Name of the event
 *   - date {string}: Event date in YYYY-MM-DD format
 */
/**
 * Retrieves Clemson campus events from the external API using native fetch.
 * Falls back to a static list if the API fails or is offline.
 *
 * @returns {Promise<Array<Object>>} Array of event objects
 */

//getEvents() api
const CLIENT_EVENTS_URL = process.env.CLIENT_EVENTS_URL;

const GETEVENTSAPI = `${CLIENT_EVENTS_URL}/api/events`;


const getEvents = async () => 
  {
  try 
  {
    const response = await fetch(GETEVENTSAPI, { method: 'GET' });

    //Throws an error if events are unable to be fetched
    if (!response.ok) 
    {
      throw new Error(`Failed to fetch events. Status: ${response.status}`);
    }

    //Collects event data
    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.events)) return data.events;

    console.error('Unexpected error occured while retreiving data:', data);
    return [];
  } 
  catch (err) 
  {
    console.error('Error fetching events:', err.message);

    //Dummy events to display if an error occurs (used mostly for testing stuff)
    return [
      { id: 1, name: 'Festival', date: '2025-09-01', tickets: 100 },
      { id: 2, name: 'Campus Concert', date: '2025-09-10', tickets: 0 },
      { id: 3, name: 'Career Fair', date: '2025-09-15', tickets: 0 },
    ];
  }
};

module.exports = { getEvents };
