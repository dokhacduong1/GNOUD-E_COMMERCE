
create database product_sql

CREATE TABLE Categories (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL,
    Slug VARCHAR(255) NOT NULL,
    ParentID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tạo bảng Products
-- Tạo bảng Products với thêm các cột ShortDescription, Description và ImageLink
CREATE TABLE Products (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Category_ID INT,
    Slug VARCHAR(255) NOT NULL,
    Featured BOOLEAN DEFAULT FALSE,
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    DiscountPercent INT DEFAULT 0,
    Description TEXT,
    ImageLink VARCHAR(255) DEFAULT "",
    Price DECIMAL(10, 2) NOT NULL,
    Product_Sample_Information VARCHAR(255),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProductInformation (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Product_ID INT,
    Info_Key VARCHAR(255),
    Info_Value TEXT,
    FOREIGN KEY (Product_ID) REFERENCES Products(ID),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE SizeSpecifications (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Product_ID INT,
    TextOption TEXT,
    FOREIGN KEY (Product_ID) REFERENCES Products(ID),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE ProductOptions (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Product_ID INT,
  Title VARCHAR(50),
  Color VARCHAR(255),
  List_Options Text,
  Stock INT,
  FOREIGN KEY (Product_ID) REFERENCES Products(ID),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProductImages (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Option_ID INT,
    ImageURL VARCHAR(255),
    FOREIGN KEY (Option_ID) REFERENCES ProductOptions(ID),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProductPreview (
    ID INT AUTO_INCREMENT,
    Product_ID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    DiscountPercent INT DEFAULT 0,
    Category_ID INT,
    Featured BOOLEAN DEFAULT FALSE,
    Slug VARCHAR(255) NOT NULL,
    NumberOfPurchases INT DEFAULT 0,
    Deleted BOOLEAN DEFAULT FALSE,
    Options TEXT,
    Status ENUM('active', 'inactive') DEFAULT 'active',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID, Product_ID)
)
PARTITION BY RANGE (Product_ID) (
    PARTITION p0 VALUES LESS THAN (100000),
    PARTITION p1 VALUES LESS THAN (200000),
    PARTITION p2 VALUES LESS THAN (300000),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);
-- New product
CREATE INDEX idx_status_created_at ON ProductPreview (Status, Created_At);
CREATE INDEX idx_status_category ON ProductPreview (Status,Deleted, Category_ID,Product_ID,Price);
CREATE INDEX idx_status_number_of_purchases ON ProductPreview (Status,Deleted, NumberOfPurchases);
CREATE INDEX idx_title_slug ON ProductPreview (Title, Slug);

CREATE INDEX idx_categories_parentid ON categories(ParentID);
CREATE INDEX idx_productinformation_product_id ON ProductInformation(Product_ID);
CREATE INDEX idx_sizespecifications_product_id ON SizeSpecifications(Product_ID);

CREATE INDEX idx_productoptions_product_id ON ProductOptions(Product_ID);
CREATE INDEX idx_productoptions_product_id_title_color_lo_stock ON ProductOptions(Product_ID,Title,Color);


CREATE INDEX idx_productimages_option_id ON ProductImages(Option_ID);
CREATE INDEX idx_productimages_option_id_image_url ON ProductImages(Option_ID,ImageURL);

CREATE INDEX idx_products_slug ON Products(Slug);

explain analyze  SELECT ID,Product_ID,Category_ID, Title, Price, DiscountPercent, Category_ID
FROM ProductPreview
WHERE Status="active" and Deleted = false and Category_ID = 9 AND Product_ID > 67 and Product_ID <100000 and Price <300
ORDER BY Product_ID ASC
LIMIT 10;

-- Tạo bảng Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Role ENUM('Admin', 'User') DEFAULT 'User',
    Status ENUM('Active', 'Inactive','Ban') DEFAULT 'Active',
    Email VARCHAR(255),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Tạo bảng Customers
-- Tạo bảng Customers
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL,
    Contact VARCHAR(255),
    Address VARCHAR(255),
    UserID int DEFAULT null,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng Orders
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    OrderDate DATE NOT NULL,
    CustomerID INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Customers_Orders
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Tạo bảng OrderDetails
CREATE TABLE OrderDetails (
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (OrderID, ProductID),
    CONSTRAINT FK_Orders_OrderDetails
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_Products_OrderDetails
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

























INSERT INTO categories (CategoryName, ParentID)
VALUES 
('Quần Áo', NULL),
('Áo Nam', 1),
('Áo Nữ', 1)


INSERT INTO Products (ProductName, Slug, Featured, Stock, Status, DiscountPercent, Description, ImageLink, Price)
VALUES 
('Áo Polo Ngắn Tay', 'ao-polo-ngan-tay', TRUE, 50, 'Active', 0, 'Nó nhẹ, bền và dễ khô sau khi giặt. Có thể mặc cả khi bật và tắt.', 'https://www.muji.com/public/media/img/item/4550583721800_1260.jpg', 299999,false),
('Áo Thun Ngắn Tay', 'ao-thun-ngan-tay', TRUE, 50, 'Active', 0, 'Nó nhẹ, bền và dễ khô sau khi giặt. Có thể mặc cả khi bật và tắt.', 'https://www.muji.com/public/media/img/item/4550583935757_1260.jpg?im=Resize,width=800', 399999,false)


--Tạo bảng category_count để lưu số lượng sản phẩm của từng danh mục
CREATE TABLE categories_count (
    id INT PRIMARY KEY,
    count INT DEFAULT 0,
    count_status_inactive INT DEFAULT 0,
     count_deleted int DEFAULT 0,
    
);
INSERT INTO category_count (id, count) VALUES (1, 0);





--Tạo bảng products_count để lưu số lượng sản phẩm của từng danh mục
CREATE TABLE products_count (
    id INT PRIMARY KEY,
    count INT DEFAULT 0,
    count_status_inactive INT DEFAULT 0
    count_deleted int DEFAULT 0,
);
INSERT INTO products_count (id, count) VALUES (1, 0);





CREATE TABLE trash (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(255),
    data: TEXT,
     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
SHOW VARIABLES LIKE 'event_scheduler';
SET GLOBAL event_scheduler = ON;


