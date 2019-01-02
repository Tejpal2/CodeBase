using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppCardioBLL.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppCardioAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public IActionResult TestFunction()
        {
            try
            {
                var result = _accountService.GetData();
                return Ok(result);
                //throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                throw  ex;
            }
        }
    }
}