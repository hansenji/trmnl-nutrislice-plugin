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
          let currentSection = "General";
          const sections = {};
          
          day.menu_items.forEach(item => {
            if (item.food === null && item.text && item.text.trim() !== "") {
              currentSection = item.text.trim();
            } else if (item.food !== null && item.food.name) {
              if (!sections[currentSection]) {
                sections[currentSection] = [];
              }
              sections[currentSection].push(item.food.name);
            }
          });

          const optionSectionKeys = Object.keys(sections).filter(key => {
            const lowerKey = key.toLowerCase();
            return !lowerKey.includes("side") && !lowerKey.includes("general") && !lowerKey.includes("milk") && !lowerKey.includes("beverage");
          });

          const generalSidesKeys = Object.keys(sections).filter(key => {
            const lowerKey = key.toLowerCase();
            return lowerKey.includes("side") || lowerKey.includes("general") || lowerKey.includes("milk") || lowerKey.includes("beverage");
          });

          let main_1 = "";
          let sides_1 = "";
          let main_2 = "";
          let sides_2 = "";

          const generalSidesList = [];
          generalSidesKeys.forEach(key => {
            generalSidesList.push(...sections[key]);
          });
          const sides = generalSidesList.join(", ");

          if (optionSectionKeys.length >= 1) {
            const key1 = optionSectionKeys[0];
            main_1 = sections[key1][0] || "";
            sides_1 = sections[key1].slice(1).join(", ");
            
            if (optionSectionKeys.length >= 2) {
              const key2 = optionSectionKeys[1];
              main_2 = sections[key2][0] || "";
              sides_2 = sections[key2].slice(1).join(", ");
            }
          } else {
            const allKeys = Object.keys(sections);
            if (allKeys.length >= 1) {
              const key1 = allKeys[0];
              main_1 = sections[key1][0] || "";
              sides_1 = sections[key1].slice(1).join(", ");
            }
          }

          return {
            date: day.date,
            main_1: main_1 || "No Lunch",
            sides_1,
            main_2,
            sides_2,
            sides
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
