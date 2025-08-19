PokeLib 3D: A Modern 3D Pokédex
PokeLib 3D is a dynamic and visually rich web application that brings the world of Pokémon to life. Built with modern web technologies, it provides a seamless and interactive experience for browsing Pokémon, viewing their stats, and exploring their various forms in a stunning 3D environment.

<img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/7992eb91-d884-4810-823e-c0d735d31764" />
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/c8d95f42-c806-4a81-bef4-eea5411f7afb" />


This project leverages the power of Next.js for server-side rendering and react-three-fiber for creating beautiful 3D visualizations, offering a fluid and engaging user interface.

✨ Features
Interactive 3D Models: View high-quality, animated 3D models of each Pokémon with automatic scaling and positioning.

Comprehensive Data: Get detailed information for each Pokémon, including types, base stats, and abilities, fetched from the official PokéAPI.

Form Variations: Easily switch between different Pokémon forms (e.g., regular, shiny, mega evolutions) and see the 3D model update in real-time.

Seamless Navigation: Browse with ease using "Next" and "Previous" buttons, or return to the main library at any time.

Fully Responsive: The application is designed to be fully responsive, providing a consistent and intuitive experience on desktops, tablets, and mobile devices.

Engaging Loading State: A custom-built 3D Poke Ball loading spinner makes waiting for data a visually appealing experience.

Robust Error Handling: The application gracefully handles potential issues like missing 3D models by providing smart fallbacks and error boundaries.

🛠️ Tech Stack
This project is built with a modern, performant, and scalable tech stack:

Framework: Next.js (React)

3D Rendering: React Three Fiber & Drei

Styling: Tailwind CSS

Data Fetching: Native Fetch API

Deployment: Vercel

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
You will need to have Node.js (version 16.x or later) and npm installed on your machine.

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/vednashday/PokeLib_3D.git
Navigate to the project directory:

Bash

cd PokeLib_3D
Install the dependencies:
It's recommended to use the --legacy-peer-deps flag to avoid version conflicts with the three library.

Bash

npm install --legacy-peer-deps
Run the development server:

Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

API Usage
This project utilizes two main APIs:

Pokemon 3D API: Used to fetch the list of Pokémon and the URLs for their 3D models.

PokéAPI: The official source for all detailed Pokémon data, including stats, types, and abilities.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement."

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
