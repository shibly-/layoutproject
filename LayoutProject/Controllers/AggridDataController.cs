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
        [Route("getLayoutList")]
        [HttpGet]
        public string getLayoutList() {
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/app/assets/"));
            if (!exists)
                return string.Empty;               

            var filePath = HttpContext.Current.Server.MapPath("~/app/assets/LayoutList.json");
            using (StreamReader r = new StreamReader(filePath))
            {
                string json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<LayoutListModel>(json);
                var obj = JsonConvert.SerializeObject(items, Formatting.Indented,
                            new JsonSerializerSettings
                            {
                                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                            });

                return obj;
            }
        }

        [Route("getLayoutData")]
        [HttpGet]
        public string getLayoutData()
        {
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/app/assets/"));
            if (!exists)
                return string.Empty;

            var filePath = HttpContext.Current.Server.MapPath("~/app/assets/LayoutData.json");
            using (StreamReader r = new StreamReader(filePath))
            {
                string json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<LayoutDModel>(json);
                var obj = JsonConvert.SerializeObject(items, Formatting.Indented,
                            new JsonSerializerSettings
                            {
                                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                            });

                return obj;
            }
        }

        [Route("saveLayoutData")]
        [HttpPost]
        public void saveLayoutData([FromBody]LayoutDModel LayoutDetails)
        {
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/app/assets/"));
            if (exists) {
                var filePath = HttpContext.Current.Server.MapPath("~/app/assets/LayoutData.json");
                using (StreamReader r = new StreamReader(filePath))
                {
                    string json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<LayoutDModel>(json);

                   
                }
            }
        }
    }
    
    public class LayoutListModel
    {
        public List<string> LayoutList { get; set; }
    }

    public class LayoutDModel
    {
        public List<LayoutDetail> LayoutDetails { get; set; }

        public class LayoutDetail
        {
            public int LayoutID { get; set; }
            public string LayoutDescr { get; set; }
            public List<DataInfo> DataList { get; set; }
        }

        public class DataInfo
        {
            public int id { get; set; }
            public int col_num { get; set; }
            
            public string col_name { get; set; }
            public string standard_col_name { get; set; }
            public string data_type { get; set; }

            public bool mandatory_col { get; set; }
            public bool unique_key { get; set; }
        }
    }
    
}