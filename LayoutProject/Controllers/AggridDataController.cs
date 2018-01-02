using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
        // GET api/<controller>
        [HttpGet]
        public string getLayoutList() {
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/app/assets/"));
            if (!exists)
                return string.Empty;               

            var filePath = HttpContext.Current.Server.MapPath("~/app/assets/LayoutList.json");
            using (StreamReader r = new StreamReader(filePath))
            {
                string json = r.ReadToEnd();
                var obj = JsonConvert.SerializeObject(json, Formatting.Indented,
                            new JsonSerializerSettings
                            {
                                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                            });

                return obj;
            }           
        }
    }
    
    public class LayoutListModel
    {
        public dynamic LayoutList { get; set; }
    }
}