export const apiUrlUser = "https://v2.api.noroff.dev/blog/posts";
export const apiUrl = `https://v2.api.noroff.dev/`;

// Register and Login
const registerData = {
  name: "SerenaTravel",
  email: "annaas00208@stud.noroff.no",
  password: "firstRegisterApiPasswordSerena",
  bio: "This is my profile bio",
  venueManager: true,
};

const loginData = {
  email: "annaas00208@stud.noroff.no",
  password: "firstRegisterApiPasswordSerena",
};

try {
  const loginResponse = await loginOwner(loginData);
  console.log("Login successfull;", loginResponse);
  if (loginResponse && loginResponse.data && loginResponse.data.accessToken);
  localStorage.setItem(`token`, loginResponse.data.accessToken);
} catch (error) {
  console.error("Login failed:", error);
}

export async function registerUser(registerData) {
  const response = await fetch(`${apiUrl}auth/register`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

export async function loginOwner(loginData) {
  const response = await fetch(`${apiUrl}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

// Perform login and save the token
export async function performLogin(loginData) {
  try {
    const loginResponse = await loginOwner(loginData);
    console.log("Login successful:", loginResponse);
    localStorage.setItem("token", loginResponse.data.accessToken); // Assuming token is directly available
    return loginResponse; // Return the login response for possible use later
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Rethrowing error to be handled in the calling scope
  }
}

// Fetch all products
// Fetch all posts, with Authorization header if needed
// export async function getPosts(name, accessToken) {
//   // accessToken parameter added
//   try {
//     const headers = {};
//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     const response = await fetch(`${apiUrlUser}/${name}`, {
//       method: "GET",
//       headers: headers,
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }
// }

// avatar: {
//     url: "https://img.service.com/avatar.jpg", // Optional
//     alt: "SerenaAvatar" // Optional
//   },
// banner: {
//     url: "https://img.service.com/banner.jpg", // Optional
//     alt: "Travel diary" // Optional
//   },