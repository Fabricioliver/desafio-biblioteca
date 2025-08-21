using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Biblioteca.Application.DTOs
{
    namespace Biblioteca.Application.DTOs
    {
        public class AutorDto
        {
            public int Id { get; set; }
            public string Nome { get; set; } = string.Empty;
        }

        public class CreateAutorDto
        {
            public string Nome { get; set; } = string.Empty;
        }

        public class UpdateAutorDto
        {
            public string Nome { get; set; } = string.Empty;
        }
    }

}
