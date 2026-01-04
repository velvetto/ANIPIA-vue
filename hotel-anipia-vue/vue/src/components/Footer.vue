<template>
  <footer class="footer">
    <div class="footer-map">
      <div class="footer-map-container">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.278953577312!2d14.424697076920205!3d50.08106391389126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b9492b3a277e1%3A0xeaf4ed444e9dc72d!2zVsOhY2xhdnNrw6kgbsOhbS4gNzk2LzQ0LCAxMTAgMDAgTm92w6kgTcSbc3Rv!5e0!3m2!1sru!2scz!4v1731524861110!5m2!1sru!2scz"
        style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="footer-contacts">
        <h3>Contacts</h3>
        <p>Address: Vaclavske nam. 796/44, Prague</p>
        <p>Email: hotel.anipia@gmail.com</p>
        <p>Phone: +420 775 111 645</p>
      </div>
    </div>
    <div class="footer-hours">
      <h3>Opening hours</h3>
      <p>Monday - Friday: 8:00 - 20:00</p>
      <p>Saturday: 10:00 - 16:00</p>
      <p>Sunday: Closed</p>
    </div>
    <div class="footer-links">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/gallery">Gallery</router-link></li>
        <li><router-link to="/prices">Prices</router-link></li>
      </ul>
    </div>
    <div class="footer-copyright">
      <p> &copy; 2024 Anipia. All Rights Reserved</p>
    </div>
  </footer>
</template>
