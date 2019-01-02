using Core.Common.APIModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sumeru.Flex;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTiger.Core.Utilities;
using APIController;
using DemoEnSource.Services.IServices.DemoEnSourceLead;
using System.Net.Http;
using System.Xml;
using DemoEnSource.Common.APIModels.Lead;
using System.Reflection.Metadata;
using System.Text;
using System.IO;
using System.Xml.Linq;
using System.Net;
using System.IdentityModel.Tokens.Jwt;
using ENTiger;
using DemoEnSource.Common.APIModels.Lead.InPut;
using Microsoft.AspNetCore.Authorization;
using ENTiger.Core.APIModels.Leads;

namespace DemoEnSource.WebApi.Controllers.Lead
{
   
    [Route("api/mvp")]
    public class DemoEnSourceLeadController : Controller
    {

        private IDemoEnSourceLead _processLead { get; set; }
        private string _UserID { get; set; }

        ILogger logger = FlexLogger.GetLogger(typeof(DemoEnSourceLeadController));

        public DemoEnSourceLeadController(IDemoEnSourceLead processLead, IHttpContextAccessor httpContextAccessor)
            : base()
        {
            _processLead = processLead;
            if (httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                _UserID = httpContextAccessor.HttpContext.User.Claims.Where(a => a.Type.ToLower() == "sub").FirstOrDefault().Value;
            }
        }

        /// <summary>
        /// Lead FE credit 
        /// </summary>
        /// <param name="xml"></param>
        /// <returns></returns>
        [HttpPost, Route("add/lead/FECredit")]
        public IActionResult PostAddLead([FromBody] XElement xml)
        {
            try
            {
                string applicationUserId = "";


                string customId = ENTiger.DomainModelUtilities.GenerateCustomId("lead").ToString();
                if (customId == "")
                {
                    return BadRequest();
                }
                var returnObj = _processLead.AddLead(xml, applicationUserId, customId);

                if (returnObj.Status != Status.Success)
                {
                    return BadRequest(returnObj.result.ToString());
                }

                return Ok(returnObj.result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead " + ex);
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Add Lead for sales
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, Route("Saleslead/addLead")]
        public IActionResult PostAddSalesLead([FromBody]AddLeadInputAPIModel model)
        {
            try
            {
                string applicationUserId = "";

                applicationUserId = APIController.Utilities.GetApplicationIDbyUserID(_UserID); ;

                string customId = DomainModelUtilities.GenerateCustomId("lead").ToString();
                if (customId == "")
                {
                    return BadRequest();
                }

                var returnObj = _processLead.AddSalesLead(model, applicationUserId, customId);

                if (returnObj.Status != Status.Success)
                {
                    foreach (var v in returnObj.Errors())
                    {
                        foreach (var err in v.Value)
                        {
                            ModelState.AddModelError(v.Key, err.ErrorMessage);
                        }
                    }
                    return BadRequest(ModelState);
                }

                var result = new { message = returnObj.Message, customId };
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead " + ex);
                return Ok();
            }
        }

        /// <summary>
        /// External Lead for Add sale
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        [Route("lead/AddSalesLeadExternal")]
        public IActionResult PostAddSalesLeadExternal([FromBody]AddLeadInputAPIModel model)
        {
            try
            {
                string applicationUserId = "";

                applicationUserId = APIController.Utilities.GetApplicationIDbyUserID(_UserID);

                string customId = DomainModelUtilities.GenerateCustomId("lead").ToString();
                if (customId == "")
                {
                    return BadRequest();
                }

                var returnObj = _processLead.AddSalesLeadExternal(model, applicationUserId, customId);

                if (returnObj.Status != Status.Success)
                {
                    foreach (var v in returnObj.Errors())
                    {
                        foreach (var err in v.Value)
                        {
                            ModelState.AddModelError(v.Key, err.ErrorMessage);
                        }
                    }
                    return BadRequest(ModelState);
                }

                var result = new { message = returnObj.Message, customId };
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead " + ex);
                return Ok();
            }
        }

        /// <summary>
        /// Add Lead Valuation
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, Route("Saleslead/addLeadvaluation")]
        public IActionResult AddLeadValuation([FromBody]AddLeadValuationInputApiModel model)
        {
            try
            {
                string applicationUserId = "";

                applicationUserId = APIController.Utilities.GetApplicationIDbyUserID(_UserID);
                var returnObj = _processLead.AddLeadValuation(model, applicationUserId);

                if (returnObj.Status != Status.Success)
                {
                    foreach (var v in returnObj.Errors())
                    {
                        foreach (var err in v.Value)
                        {
                            ModelState.AddModelError(v.Key, err.ErrorMessage);
                        }
                    }
                    return BadRequest(ModelState);
                }

                return Ok(returnObj.result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead valuation " + ex);
                return Ok();
            }
        }

        /// <summary>
        /// Update Lead valuation
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, Route("Saleslead/updateLeadvaluation")]
        public IActionResult UpdateLeadValuation([FromBody]UpdateLeadValuationInputApiModel model)
        {
            try
            {
                string applicationUserId = "";

                applicationUserId = APIController.Utilities.GetApplicationIDbyUserID(_UserID);
                var returnObj = _processLead.UpdateLeadValuation(model, applicationUserId);

                if (returnObj.Status != Status.Success)
                {
                    foreach (var v in returnObj.Errors())
                    {
                        foreach (var err in v.Value)
                        {
                            ModelState.AddModelError(v.Key, err.ErrorMessage);
                        }
                    }
                    return BadRequest(ModelState);
                }

                return Ok(returnObj.result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead valuation " + ex);
                return Ok();
            }
        }

        /// <summary>
        /// Get Lead Valuation
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, Route("Saleslead/GetLeadvaluation")]
        public IActionResult GetLeadValuation([FromBody]GetLeadValuationInputApiModel model)
        {
            try
            {

                var returnObj = _processLead.GetLeadValuation(model);

                if (returnObj.Status != Status.Success)
                {
                    foreach (var v in returnObj.Errors())
                    {
                        foreach (var err in v.Value)
                        {
                            ModelState.AddModelError(v.Key, err.ErrorMessage);
                        }
                    }
                    return BadRequest(ModelState);
                }

                return Ok(returnObj.result);
            }
            catch (System.Exception ex)
            {
                logger.LogError("Exception in add lead valuation " + ex);
                return Ok();
            }
        }
    }
}
