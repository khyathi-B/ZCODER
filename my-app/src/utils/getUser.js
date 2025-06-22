export default function getUser() {
  const data = localStorage.getItem('user');
  if (!data) return null;

try {
    const parsed = JSON.parse(data);
    console.log("Parsed user from localStorage:", parsed);
    return parsed; 
  } catch {
    console.log("catched something error");
    return null;
  }
}
