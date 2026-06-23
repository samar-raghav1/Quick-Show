resource "aws_eks_cluster" "quick_show_cluster_server" {
    name     = "quickshow-cluster-server"
    role_arn = aws_iam_role.eks_role.arn

    vpc_config {
        subnet_ids = aws_subnet.eks_subnet[*].id
    }

    tags = {
        Name = "quickshow-cluster-server"
    }
}

resource "aws_eks_node_group" "quick_show_node_group_server" {
    cluster_name    = aws_eks_cluster.quick_show_cluster_server.name
    node_group_name = "quickshow-node-group-server"
    node_role_arn   = aws_iam_role.eks_node_role.arn
    subnet_ids      = aws_subnet.eks_subnet[*].id

    scaling_config {
        desired_size = 2
        max_size     = 3
        min_size     = 1
    }

    instance_types = ["t3.micro"]

    tags = {
        Name = "quickshow-node-group-server"
    }
}
