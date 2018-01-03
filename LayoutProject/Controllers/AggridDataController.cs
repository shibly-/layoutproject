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
        private string layoutFilePath = "~/app/assets/";
        private string layoutDataFile = "LayoutData.json";
        private string layoutListFile = "LayoutList.json";

        [Route("getLayoutList")]
        [HttpGet]
        public string getLayoutList() {
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(this.layoutFilePath));
            if (!exists)
                return string.Empty;               

            var filePath = HttpContext.Current.Server.MapPath(String.Concat(this.layoutFilePath, this.layoutListFile));
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
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(this.layoutFilePath));
            if (!exists)
                return string.Empty;

            var filePath = HttpContext.Current.Server.MapPath(String.Concat(this.layoutFilePath, this.layoutDataFile));
            using (StreamReader r = new StreamReader(filePath))
            {
                string json = r.ReadToEnd();
                var layoutsFromFile = JsonConvert.DeserializeObject<LayoutDModel>(json);
                foreach (LayoutDModel.LayoutDetail layout in layoutsFromFile.LayoutDetails)
                {
                    if(!layout.IsDeleted)
                        layout.IsDeleted = false;
                }

                //layoutsFromFile.LayoutDetails.RemoveAll(x => x.IsDeleted);
                var obj = JsonConvert.SerializeObject(layoutsFromFile, Formatting.Indented,
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
            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(this.layoutFilePath));
            if (exists) {

                LayoutDModel layoutsFromFile = new LayoutDModel();

                var filePath = HttpContext.Current.Server.MapPath(String.Concat(this.layoutFilePath, this.layoutDataFile));
                using (StreamReader r = new StreamReader(filePath))
                {
                    string json = r.ReadToEnd();
                    layoutsFromFile = JsonConvert.DeserializeObject<LayoutDModel>(json);

                    if (LayoutDetails.LayoutDetails.Count > 0 && LayoutDetails.LayoutDetails[0].LayoutID > 0) {
                        var layoutID = LayoutDetails.LayoutDetails[0].LayoutID;
                        var dataList = LayoutDetails.LayoutDetails[0].DataList;

                        dataList.RemoveAll(x => String.IsNullOrWhiteSpace(x.col_name));
                        foreach (LayoutDModel.LayoutDetail layout in layoutsFromFile.LayoutDetails) {
                            if (layout.LayoutID == layoutID) {
                                layout.DataList = dataList;
                            }
                            if (LayoutDetails.LayoutDetails[0].IsDeleted)
                                layout.IsDeleted = LayoutDetails.LayoutDetails[0].IsDeleted;
                        }
                    }
                }

                // update the LayoutData.json file
                using (StreamWriter file = File.CreateText(filePath))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, layoutsFromFile);
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
            public bool IsDeleted { get; set; }
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