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

namespace LayoutProject.Controllers
{
    [RoutePrefix("api/MongoDB")]
    public class MongoDBController : ApiController
    {
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
                          { "COL_NAME", "Col1" },
                          { "MANDATORY", 1 },
                          { "IMS_COLUMN_NAME", "Col1" },
                          { "DATA_COLUMN_TYPE", "string" }
                        }, new BsonDocument {
                          { "COL_ID", 2 },
                          { "COL_NAME", "Col2" },
                          { "MANDATORY", 0 },
                          { "IMS_COLUMN_NAME", "Col2" },
                          { "DATA_COLUMN_TYPE", "string" }
                        }
                    }
                  },
                  { "Active_Ind", true },
                  { "Created_date", DateTime.Now },
                  { "Modified_date", DateTime.Now }
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
                                    Builders<BsonDocument>.Filter.Eq("Layout_id", 1000),
                                    Builders<BsonDocument>.Update.Set("Layout_Description", "Test Description Updated"));
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [Route("deleteData")]
        [HttpGet]
        public bool DeleteData()
        {
            var _database = connectionHelper();
            if (_database == null)
                return false;

            var _collection = _database.GetCollection<BsonDocument>("layoutconfiguration");

            var filter = Builders<BsonDocument>.Filter.Eq("Layout_id", 1000);

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
            public int Layout_id { get; set; }
            public string Layout_Description { get; set; }
            public List<Columns> Columns { get; set; }
            public bool Active_Ind { get; set; }
            public DateTime Created_date { get; set; }
            public DateTime Modified_date { get; set; }
        }

        public class Columns
        {
            public int COL_ID { get; set; }
            public string COL_NAME { get; set; }
            public int MANDATORY { get; set; }
            public string IMS_COLUMN_NAME { get; set; }
            public string DATA_COLUMN_TYPE { get; set; }
        }
    }
}