let token = null;
const url = 'http://localhost:3000';

document.getElementById('regForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const result = await response.json();
    document.getElementById('regMessage').textContent = result.message || 'Не удалось зарегистрироваться';

});

document.getElementById('loginForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const result = await response.json();
    
    if (response.ok){
        token = result.token;
        document.getElementById('loginMessage').textContent = 'Вы успешно вошли';
    } else{
        document.getElementById('loginMessage').textContent = result.message || "Не удалось войти";
    }
});

function displayData(data){
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const formattedPayload = JSON.stringify(decodedPayload, null, 2);

    const protectedDataContainer = document.getElementById('protectedData');
    protectedDataContainer.style.display = "block";

    protectedDataContainer.innerHTML = `
    <div class="data-item">${data.message}</div>
    <div class="data-item">User ID: ${data.user.userId}</div>
    <div class="token-container">
        <div class="token-part"><strong>Заголовок:</strong> <pre>${header}</pre></div>
        <div class="token-part"><strong>Полезная нагрузка:</strong> <pre>${payload}</pre></div>
        <div class="token-part_1"><strong>Расшифрованная полезная нагрузка:</strong> <pre>${formattedPayload}</pre></div>
        <div class="token-part"><strong>Подпись:</strong> <pre>${signature}</pre></div>
    </div>
`;
}

document.getElementById('fetchProtectedData').addEventListener('click', async() => {
    if (!token){
        document.getElementById('protectedData').textContent = 'Сначала необходимо войти!';
        return;
    }

    const response = await fetch(`${url}/protected`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const result = await response.json();
    if (response.ok){
        // document.getElementById('protectedData').textContent = JSON.stringify(result);
        displayData(result);
    } else{
        document.getElementById('protectedData').textContent = "Доступ запрещен";
    }
});