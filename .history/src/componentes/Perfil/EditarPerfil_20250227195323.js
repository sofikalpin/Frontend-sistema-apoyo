using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SistemaApoyo.BLL.Servicios.Contrato;
using SistemaApoyo.DAL.Repositorios.Contrato;
using SistemaApoyo.DTO;
using SistemaApoyo.Model;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Net;
using Microsoft.Extensions.Logging;
using SistemaApoyo.DAL.DBContext;

namespace SistemaApoyo.BLL.Servicios
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepositorio;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UsuarioService> _logger;
        private readonly RailwayContext _context;

        public UsuarioService(IGenericRepository<Usuario> usuarioRepositorio, IMapper mapper, IConfiguration configuration, ILogger<UsuarioService> logger, RailwayContext context)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
            _context = context;
        }

        public async Task<UsuarioDTO> Crear(UsuarioDTO modelo)
        {
            try
            {
                var usuario = _mapper.Map<Usuario>(modelo);

                // Hashear la contraseña antes de guardarla
                usuario.ContraseñaHash = CubreContrasena(modelo.ContraseñaHash);

                // Verificar si el correo ya existe
                var usuarioExistente = await _usuarioRepositorio.Obtener(u => u.Correo == modelo.Correo);
                if (usuarioExistente != null)
                {
                    throw new InvalidOperationException("El correo ya está registrado");
                }

                var usuarioCreado = await _usuarioRepositorio.Crear(usuario);
                if (usuarioCreado.Idusuario == 0)
                    throw new Exception("No se pudo crear el usuario");

                var query = await _usuarioRepositorio.Consultar(u => u.Idusuario == usuarioCreado.Idusuario);
                usuarioCreado = query.Include(u => u.IdrolNavigation).FirstOrDefault();

                return _mapper.Map<UsuarioDTO>(usuarioCreado);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear usuario: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> Editar(UsuarioDTO modelo)
        {
            try
            {   
                if (modelo == null)
                {
                    throw new ArgumentNullException("El modelo de usuario es nulo.");
                }

                var usuarioModelo = _mapper.Map<Usuario>(modelo);
                
                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u => u.Idusuario == usuarioModelo.Idusuario);
                
                if (usuarioEncontrado == null)
                {
                    throw new InvalidOperationException("El usuario no existe");
                }

                // Si la contraseña está vacía o nula, no la actualizamos
                if (!string.IsNullOrEmpty(usuarioModelo.ContraseñaHash))
                {
                    usuarioEncontrado.ContraseñaHash = CubreContrasena(usuarioModelo.ContraseñaHash);
                }

                usuarioEncontrado.Nombrecompleto = usuarioModelo.Nombrecompleto;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.Idnivel = usuarioModelo.Idnivel;
                usuarioEncontrado.Idrol = usuarioModelo.Idrol;
                usuarioEncontrado.CvRuta = usuarioModelo?.CvRuta;
                usuarioEncontrado.FotoRuta = usuarioModelo?.FotoRuta;

                bool respuesta = await _usuarioRepositorio.Editar(usuarioEncontrado);
                if (!respuesta)
                    throw new Exception("No se pudo editar el usuario");

                return respuesta;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al editar usuario: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u => u.Idusuario == id);
                if (usuarioEncontrado == null)
                    throw new InvalidOperationException("El usuario no existe");

                bool respuesta = await _usuarioRepositorio.Eliminar(usuarioEncontrado);
                if (!respuesta)
                    throw new Exception("No se pudo eliminar el usuario");

                return respuesta;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al eliminar usuario: {ex.Message}");
                throw;
            }
        }

        public async Task<List<UsuarioDTO>> Lista()
        {
            try
            {
                var usuariosQuery = await _usuarioRepositorio.Consultar();
                var listaUsuarios = usuariosQuery.Include(u => u.IdrolNavigation).ToList();
                return _mapper.Map<List<UsuarioDTO>>(listaUsuarios);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener lista de usuarios: {ex.Message}");
                throw;
            }
        }

        public async Task<UsuarioDTO> ObtenerUsuarioPorID(int idusuario)
        {
            try
            {
                var usuario = await _usuarioRepositorio.Obtener(u => u.Idusuario == idusuario);
                if (usuario == null)
                {
                    Console.WriteLine($"Usuario con id {idusuario} no encontrado.");
                    throw new InvalidOperationException("Usuario no encontrado");
                }

                return _mapper.Map<UsuarioDTO>(usuario);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener usuario por correo: {ex.Message}");
                throw;
            }
        }

        public async Task<UsuarioDTO> ObtenerUsuarioPorCorreo(string correo)
        {
            try
            {
                var usuario = await _usuarioRepositorio.Obtener(u => u.Correo == correo);
                if (usuario == null)
                {
                    Console.WriteLine($"Usuario con correo {correo} no encontrado.");
                    throw new InvalidOperationException("Usuario no encontrado");
                }

                return _mapper.Map<UsuarioDTO>(usuario);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener usuario por correo: {ex.Message}");
                throw;
            }
        }

        public async Task<UsuarioDTO?> ValidarCredencialesAsync(string correo, string contraseña)
        {
            try
            {
                var usuario = await _context.Usuarios
                    .AsNoTracking()
                    .Where(u => u.Correo == correo)
                    .Select(u => new
                    {
                        u.Idusuario,
                        u.Correo,
                        u.ContraseñaHash,
                        u.Nombrecompleto,
                        u.Fecharegistro,
                        u.Idnivel,
                        u.Idrol,
                        u.AutProf,
                    })
                    .FirstOrDefaultAsync();

                if (usuario == null)
                {
                    _logger.LogWarning("Usuario no encontrado: {Correo}", correo);
                    return null;
                }

                var resultado = VerificarContrasena(contraseña, usuario.ContraseñaHash);
                _logger.LogInformation("Hash almacenado para el usuario {Correo}: {ContraseñaHash}", correo, usuario.ContraseñaHash);

                if (resultado == false)
                {
                    _logger.LogWarning("Contraseña incorrecta para el usuario: {Correo}", correo);
                    return null;
                }

                return new UsuarioDTO
                {
                    Idusuario = usuario.Idusuario,
                    Nombrecompleto = usuario.Nombrecompleto,
                    Correo = usuario.Correo,
                    Fecharegistro = usuario.Fecharegistro,
                    Idnivel = usuario.Idnivel,
                    Idrol = usuario.Idrol,
                    AutProf = usuario.AutProf,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar las credenciales.");
                return null;
            }
        }

        public async Task<bool> GenerarTokenRecuperacion(string correo)
        {
            try
            {
                var usuario = await _usuarioRepositorio.Obtener(u => u.Correo == correo);
                if (usuario == null)
                    throw new InvalidOperationException("Usuario no encontrado");

                if (!string.IsNullOrEmpty(usuario.TokenRecuperacion) &&
                    usuario.TokenExpiracion.HasValue &&
                    usuario.TokenExpiracion.Value > DateTime.UtcNow)
                {
                    usuario.TokenRecuperacion = null;
                    usuario.TokenExpiracion = null;
                    await _usuarioRepositorio.Editar(usuario);
                }

                var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

                usuario.TokenRecuperacion = token;
                usuario.TokenExpiracion = DateTime.UtcNow.AddHours(24);

                bool resultado = await _usuarioRepositorio.Editar(usuario);
                if (!resultado)
                    throw new Exception("No se pudo guardar el token de recuperación");

                await EnviarCorreoRecuperacion(usuario.Correo, token);

                _logger.LogInformation($"Solicitud de recuperación de contraseña generada para el correo: {correo} en {DateTime.UtcNow}");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error en GenerarTokenRecuperacion: {ex.Message}");
                throw;
            }
        }

        public string CubreContrasena(string contrasena)
        {
            if (string.IsNullOrEmpty(contrasena))
            {
                throw new ArgumentException("La contraseña no puede ser nula o vacía.");
            }

            var salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
                rng.GetBytes(salt);

            using (var pbkdf2 = new Rfc2898DeriveBytes(contrasena, salt, 10000, HashAlgorithmName.SHA256))
            {
                var hash = pbkdf2.GetBytes(32);
                var resultado = new byte[salt.Length + hash.Length];
                Array.Copy(salt, 0, resultado, 0, salt.Length);
                Array.Copy(hash, 0, resultado, salt.Length, hash.Length);
                return Convert.ToBase64String(resultado);
            }
        }

        public bool VerificarContrasena(string contrasena, string contrasenaHash)
        {
            if (string.IsNullOrEmpty(contrasenaHash))
                return false;

            var bytesHash = Convert.FromBase64String(contrasenaHash);
            var salt = new byte[16];
            Array.Copy(bytesHash, 0, salt, 0, salt.Length);

            using (var pbkdf2 = new Rfc2898DeriveBytes(contrasena, salt, 10000, HashAlgorithmName.SHA256))
            {
                var hash = pbkdf2.GetBytes(32);
                for (int i = 0; i < hash.Length; i++)
                {
                    if (bytesHash[i + salt.Length] != hash[i])
                        return false;
                }
            }

            return true;
        }

        private async Task EnviarCorreoRecuperacion(string correoDestino, string token)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                using var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
                {
                    Port = int.Parse(emailSettings["SmtpPort"]),
                    Credentials = new NetworkCredential(emailSettings["SmtpUser"], emailSettings["SmtpPassword"]),
                    EnableSsl = true
                };

                var resetUrl = $"{_configuration["AppBaseUrl"]}/resetpassword?token={token}";

                var mensaje = new MailMessage
                {
                    From = new MailAddress(emailSettings["SmtpUser"]),
                    Subject = "Recuperación de Contraseña",
                    Body = $"<p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href='{resetUrl}'>Restablecer contraseña</a></p>",
                    IsBodyHtml = true,
                };
                mensaje.To.Add(correoDestino);

                await smtpClient.SendMailAsync(mensaje);
                _logger.LogInformation($"Correo de recuperación enviado a {correoDestino}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar correo de recuperación.");
                throw;
            }
        }
    }
}
