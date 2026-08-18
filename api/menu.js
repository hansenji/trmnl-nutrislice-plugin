const axios = require('axios');

module.exports = async (req, res) => {
  const district = req.query.district || process.env.NUTRISLICE_DISTRICT;
  const school = req.query.school || process.env.NUTRISLICE_SCHOOL_ID;
  const meal_type = req.query.meal_type || process.env.MEAL_TYPE || 'lunch';

  if (!district || !school) {
    return res.status(400).json({ error: 'Missing parameters or environment variables: district and school are required.' });
  }

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // If Saturday or Sunday, fetch the menu for the upcoming Monday to get next week's data
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    const daysToAdd = dayOfWeek === 6 ? 2 : 1;
    now.setDate(now.getDate() + daysToAdd);
  }
  
  const currentDate = now.toISOString().split('T')[0].replace(/-/g, '/');
  const url = `https://${district}.api.nutrislice.com/menu/api/weeks/school/${school}/menu-type/${meal_type}/${currentDate}/?format=json`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const formattedSchool = school.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const simplified = {
      school_name: data.school_name || formattedSchool || "School Menu",
      days: data.days
        .filter(day => day.menu_items && day.menu_items.length > 0)
        .map(day => {
          const mainFood = day.menu_items.find(item => item.food !== null);
          
          const sidesList = day.menu_items
            .filter(item => item.food !== null && item.food.name !== (mainFood ? mainFood.food.name : ""))
            .map(item => item.food.name);
          let sides = sidesList.join(", ");
          if (sides.length > 200) {
            sides = sides.substring(0, 200) + "...";
          }

          return {
            date: day.date,
            main: mainFood ? mainFood.food.name : "No Lunch",
            sides: sides
          };
        })
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(simplified);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch menu from Nutrislice.' });
  }
};
