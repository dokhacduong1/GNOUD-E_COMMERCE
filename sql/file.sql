
create database product_sql

CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL,
    Slug VARCHAR(255) NOT NULL,
    ParentID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tạo bảng Products
-- Tạo bảng Products với thêm các cột ShortDescription, Description và ImageLink
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Slug VARCHAR(255) NOT NULL,
    Featured BOOLEAN DEFAULT FALSE,
    Stock INT DEFAULT 0,
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    DiscountPercent INT DEFAULT 0,
    Description TEXT,
    ImageLink VARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



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


-- Tạo bảng Colors với thêm cột ColorLink
CREATE TABLE Colors (
    ColorID INT AUTO_INCREMENT PRIMARY KEY,
    ColorName VARCHAR(50) NOT NULL,
    ColorLink VARCHAR(255),
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    Slug VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng ProductColors
CREATE TABLE ProductColors (
    ProductID INT,
    ColorID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductID, ColorID),
    CONSTRAINT FK_Products_ProductColors
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT FK_Colors_ProductColors
    FOREIGN KEY (ColorID) REFERENCES Colors(ColorID)
);


CREATE TABLE Sizes (
    SizeID INT AUTO_INCREMENT PRIMARY KEY,
    SizeName VARCHAR(50) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE ProductSizes (
    ProductID INT,
    SizeID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductID, SizeID),
    CONSTRAINT FK_Products_ProductSizes
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT FK_Sizes_ProductSizes
    FOREIGN KEY (SizeID) REFERENCES Sizes(SizeID)
);



CREATE TABLE ProductCategories (
    ProductID INT,
    CategoryID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductID, CategoryID),
    CONSTRAINT FK_Products_ProductCategories
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT FK_Categories_ProductCategories
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);


CREATE TABLE ProductImages (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    ColorID INT,
    ImageLink VARCHAR(255),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Products_ProductImages
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT FK_Colors_ProductImages
    FOREIGN KEY (ColorID) REFERENCES Colors(ColorID)
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