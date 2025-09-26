export const CLINIC_LOCATIONS = [
  {
    value: "colorado-denver",
    label: "Colorado (Denver)",
    address: "1385 W Alameda Ave, Denver, CO 80223",
    phone: "(303) 555-0123",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",

    coordinates: {
      lat: 39.70335607157403,
      lng: -105.01387722423165
    },

    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.6073091246165!2d-105.01387722423165!3d39.70335607157403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7eabc151aa0d%3A0x4ccaf1c8b3969739!2s1385%20W%20Alameda%20Ave%2C%20Denver%2C%20CO%2080223!5e0!3m2!1sen!2sus!4v1716832445696!5m2!1sen!2sus",

    features: [
      "Free parking available",
      "Wheelchair accessible", 
      "Modern equipment and facilities",
      "Easy access to public transportation"
    ]
  },
];

export const getLocationByValue = (value) => {
  return CLINIC_LOCATIONS.find(loc => loc.value === value);
};

export const getAllLocations = () => {
  return CLINIC_LOCATIONS;
};

export const DEFAULT_CLINIC_LOCATION = CLINIC_LOCATIONS[0]; 