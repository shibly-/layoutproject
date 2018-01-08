using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Driver.Core;
using MongoDB.Driver.Linq;
using System.Net;
using System.Net.Http;
using System.Configuration;
using System.Web.Http;
using System.Web.Helpers;
using Newtonsoft.Json;

namespace LayoutProject.Controllers
{
    [RoutePrefix("api/MongoDB")]
    public class MongoDBController : ApiController
    {
        [Route("getLayoutList")]
        [HttpGet]
        public string getLayoutList()
        {
            var _database = connectionHelper();
            if (_database == null)
                return null;

            try
            {
                IMongoCollection<BsonDocument> _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");
                var filter = Builders<BsonDocument>.Filter.Eq("Active_Ind", true);
                var projection = Builders<BsonDocument>.Projection.Include("Layout_Description").Exclude("_id");
                
                var data = _collection.Find<BsonDocument>(filter).Project(projection).ToList();
                var _layoutNames = data.Select(x => x["Layout_Description"].ToString()).ToList();
                
                return  JsonConvert.SerializeObject(_layoutNames, Formatting.Indented,
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

        [Route("getLayoutData")]
        [HttpGet]
        public string getLayoutData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return null;

            try
            {
                IMongoCollection<BsonDocument> _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");
                var filter = Builders<BsonDocument>.Filter.Eq("Active_Ind", true);
                var documents = _collection.AsQueryable();
                var data = _collection.Find<BsonDocument>(filter).ToList();

                var layoutData = new List<Layout>();
                foreach (var _data in data) {
                    var layout = new Layout();
                    layout.Layout_Id = _data["Layout_Id"].ToInt32();
                    layout.Layout_Description = _data["Layout_Description"].ToString();

                    var _columns = _data["Columns"].ToString();
                    var _columnList = JsonConvert.DeserializeObject<List<Columns>>(_columns);
                    layout.Columns = _columnList;

                    layout.Active_Ind = _data["Active_Ind"].ToBoolean();
                    layout.Created_Date = Convert.ToDateTime(_data["Created_Date"]);
                    layout.Modified_Date = Convert.ToDateTime(_data["Modified_Date"]);
                    layoutData.Add(layout);
                }


                var test = JsonConvert.SerializeObject(layoutData, Formatting.Indented,
                            new JsonSerializerSettings
                            {
                                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                            });
                return test;
            }
            catch (Exception ex)
            {

            }
            return null;
        }

        // GET: MongoDB
        [Route("loadData")]
        [HttpGet]
        public void LoadData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return;

            try
            {
                IMongoCollection<BsonDocument> _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");

                var documents = _collection.AsQueryable();

                var data = _collection.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {

            }
        }

        [Route("insertData")]
        [HttpGet]
        public bool InsertData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return false;

            var _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");

            var document = new BsonDocument
                {
                  { "Layout_id", "1000" },
                  { "Layout_Description", "Test Layout" },
                  { "Columns", new BsonArray {
                      new BsonDocument {
                          { "COL_ID", 1 },
                          { "COL_ORDER", 1 },
                          { "COL_NAME", "Col1" },
                          { "MANDATORY", true },
                          { "IMS_COLUMN_NAME", "Col1" },
                          { "DATA_COLUMN_TYPE", "string" },
                          { "UNIQUE_KEY", false }
                        }, new BsonDocument {
                          { "COL_ID", 2 },
                          { "COL_ORDER", 2 },
                          { "COL_NAME", "Col2" },
                          { "MANDATORY", false },
                          { "IMS_COLUMN_NAME", "Col2" },
                          { "DATA_COLUMN_TYPE", "string" },
                          { "UNIQUE_KEY", false }
                        }
                    }
                  },
                  { "Active_Ind", true },
                  { "Created_Date", DateTime.Now },
                  { "Modified_Date", DateTime.Now }                 
                };

            try
            {
                _collection.InsertOneAsync(document);
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [Route("updateData")]
        [HttpGet]
        public bool UpdateData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return false;

            var _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");

            try
            {
                var updoneresult = _collection.UpdateOneAsync(
                                    Builders<BsonDocument>.Filter.Eq("Layout_Id", 1000),
                                    Builders<BsonDocument>.Update.Set("Layout_Description", "Test Description Updated"));
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }
        
        [Route("updateLayoutData")]
        [HttpPost]
        public bool updateLayoutData([FromBody]Layout LayoutDetails)
        {
            var _database = connectionHelper();
            if (_database == null)
                return false;

            try
            {
                if (LayoutDetails.Layout_Id > 0)
                {
                    LayoutDetails.Columns.RemoveAll(x => String.IsNullOrWhiteSpace(x.COL_NAME));
                    IMongoCollection<BsonDocument> _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");                   
                    var filter = Builders<BsonDocument>.Filter.Eq("Layout_Id", LayoutDetails.Layout_Id.ToString());
                    var update = Builders<BsonDocument>.Update
                        .Set("Layout_Description", LayoutDetails.Layout_Description)
                        .Set("Columns", LayoutDetails.Columns)
                        .Set("Active_Ind", LayoutDetails.Active_Ind)
                        .CurrentDate("Modified_Date");

                    var result = _collection.UpdateOne(filter, update);
                    return true;
                }
                return true;
            }
            catch (Exception ex)
            {

            }
            return false;            
        }

        [Route("deleteData")]
        [HttpGet]
        public bool DeleteData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return false;

            var _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");

            var filter = Builders<BsonDocument>.Filter.Eq("Layout_Id", 1000);

            try
            {
                _collection.DeleteOneAsync(filter);
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public IMongoDatabase connectionHelper()
        {
            try
            {
                string constring = ConfigurationManager.ConnectionStrings["MongoDBMS"].ConnectionString;
                IMongoClient _client = new MongoClient(constring);

                IMongoDatabase _database = _client.GetDatabase("test");
                return _database;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public class Layout
        {
            public int Layout_Id { get; set; }
            public string Layout_Description { get; set; }
            public List<Columns> Columns { get; set; }
            public bool Active_Ind { get; set; }
            public DateTime Created_Date { get; set; }
            public DateTime Modified_Date { get; set; }
        }

        public class Columns
        {
            public int COL_ID { get; set; }
            public int COL_ORDER { get; set; }
            public string COL_NAME { get; set; }
            public bool MANDATORY { get; set; }
            public string IMS_COLUMN_NAME { get; set; }
            public string DATA_COLUMN_TYPE { get; set; }
            public bool UNIQUE_KEY { get; set; }
        }

        public class LayoutList
        {
            public Dictionary<int, string> LayoutNames { get; set; }            
        }
    }
}