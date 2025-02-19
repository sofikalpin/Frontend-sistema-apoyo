import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend-sistema-apoyo-production.up.railway.app//chatHub")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

    hubConnection
    .start()
    .then(() => console.log("Conexión establecida"))
    .catch((error) => console.error("Error al conectar a SignalR:", error)); 

export default hubConnection;