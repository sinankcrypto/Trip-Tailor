const getTomorrowDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1); // add 1 day
  return today.toISOString().split("T")[0];
};

export default getTomorrowDate
