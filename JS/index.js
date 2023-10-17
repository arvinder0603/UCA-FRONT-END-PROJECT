


//This part is used in footer for contacting through whatsapp
const ContactUs = document.getElementById('contact');

ContactUs.addEventListener('click', () => {
    const phoneNumber = '+918588842785'; // Replace with the desired phone number
    window.open(`whatsapp://send?phone=${phoneNumber}`);
});
