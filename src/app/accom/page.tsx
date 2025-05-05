const AccomPage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Wedding Accommodation</h1>
      <p>
        Welcome to the wedding accommodation page! Here you can find information
        about the best places to stay for the wedding.
      </p>
      <section>
        <h2>Recommended Hotels</h2>
        <ul>
          <li>
            <strong>Hotel Sunshine</strong> - A cozy hotel located just 10
            minutes from the venue.
          </li>
          <li>
            <strong>Grand Plaza</strong> - A luxurious option with excellent
            amenities.
          </li>
          <li>
            <strong>Budget Inn</strong> - Affordable and comfortable for those
            on a budget.
          </li>
        </ul>
      </section>
      <section>
        <h2>Transportation</h2>
        <p>
          Shuttle services will be available from select hotels to the wedding
          venue. Please check with your hotel for details.
        </p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about accommodations, feel free to reach out
          to us at <a href="mailto:info@wedding.com">info@wedding.com</a>.
        </p>
      </section>
    </div>
  );
};

export default AccomPage;
