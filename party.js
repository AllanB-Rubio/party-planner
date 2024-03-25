const COHORT = "2401-ftb-mt-web-pt";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#eventForm");
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

async function addEvent(event) {
  event.preventDefault();

  await createEvent(
    addEventForm.name.value,
    addEventForm.description.value,
    addEventForm.date.value,
    addEventForm.location.value
  );
}

// Update UI with the new event after adding
async function createEvent(name, description, date, location) {
  try {
    // Validate date format before sending the request
    const isoDate = new Date(date).toISOString(); // Convert to ISO-8601 format
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, date: isoDate, location }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(`Failed to add event: ${data.message}`);
    }

    await render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    await render(); // Update UI after deleting event
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events found.</li>";
    return;
  }

  const eventsList = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = `
      <h2> ${event.name}</h2>
      <p> ${event.description} </p> 
      <p> ${event.date} </p> 
      <p> ${event.location} </p> 
      `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.appendChild(deleteButton); // Append deleteButton to eventCard

    // Add event listener to deleteButton
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });

  eventList.replaceChildren(...eventsList);
}
