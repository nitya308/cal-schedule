export default function Header() {
  return (
    <div style={styles.header}>
      <b>Planning an event? It starts here!</b>
      <ul>
      <li>Ask all your team members to enable free/busy sharing on their calendars! (this is a one-time step only)</li>
      <li>Plan as many events as you want, on the go 🏃 </li>
      </ul>
    </div>
  )
};

const styles = {
  header: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 18
  }
};