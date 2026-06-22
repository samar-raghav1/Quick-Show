resource "aws_eks_cluster" "quickshow_cluster" {
    name     = "quickshow-cluster"
    role_arn = aws_iam_role.eks_role.arn

    vpc_config {
        subnet_ids = aws_subnet.eks_subnet[*].id
    }

    tags = {
        Name = "quickshow-cluster"
    }
}

resource "aws_eks_node_group" "quickshow_node_group" {
    cluster_name    = aws_eks_cluster.quickshow_cluster.name
    node_group_name = "quickshow-node-group"
    node_role_arn   = aws_iam_role.eks_node_role.arn
    subnet_ids      = aws_subnet.eks_subnet[*].id

    scaling_config {
        desired_size = 2
        max_size     = 3
        min_size     = 1
    }

    instance_types = ["t3.micro"]

    tags = {
        Name = "quickshow-node-group"
    }
}
