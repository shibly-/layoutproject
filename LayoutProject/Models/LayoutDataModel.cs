using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LayoutProject.Models
{
    public class LayoutDataModel
    {
        public int LayoutID { get; set; }
        public string LayoutDescr { get; set; }
        public dynamic DataList { get; set; }
    }
}