resource "aws_vpc" "eks_vpc" {
    cidr_block = "10.0.0.0/16"
    enable_dns_support =true
    enable_dns_hostnames = true
    tags = {
        name = "eks-vpc"
    }
}
    resource "aws_subnet" "eks_subnet" {
        count = 2
        vpc_id =aws_vpc.eks_vpc.id
        cidr_block = cidr_subnet(aws_vpc.eks_vpc.cidr_block,8 , count.index)
        availability_zone = "us-east-1${count.index +1}"
        map_public_ip_on_launch= true
        tags = {
            name ="eks-subnet-${count.index +1}"
        }

    }

resource "aws_internet_gateway" "eks_igm" {
    vpc_id = aws_vpc.eks_vpc.id
}

resource "aws_route_table" "eks_rt" {
    vpc_id = aws_vpc.eks_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.eks_igm.id
    }
}

resource "aws_route_table_association" "eks_rta" {
    count = 2
    subnet_id = aws_subnet.eks_subnet[count.index].id
    route_table_id = aws_route_table.eks_rt.id
}