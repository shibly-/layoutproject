using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LayoutProject.Controllers
{
    [RoutePrefix("api/AggridData")]
    public class AggridDataController : ApiController
    {
        [Route("getLayoutColDataTypeList")]
        [HttpGet]
        public string getLayoutColDataTypeList() {
            var _columnDataTypes = new List<string>();
            try
            {
                _columnDataTypes = ReadSetting("LayoutColumnDataTypes").Trim().Split('|').ToList();
                return JsonConvert.SerializeObject(_columnDataTypes, Formatting.Indented,
                          new JsonSerializerSettings
                          {
                              ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                          });
            }
            catch (Exception ex)
            {
                
            }
            return null;
        }

        private string ReadSetting(string key)
        {
            try
            {
                var appSettings = ConfigurationManager.AppSettings;
                return appSettings[key] ?? "";
            }
            catch (ConfigurationErrorsException)
            {
                
            }
            return "";
        }        
    }
}